"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const typeorm_1 = require("typeorm");
const requestPromise = require("request-promise");
const cheerio = require("cheerio");
const Content_1 = require("../entities/Content");
const Categories_1 = require("../entities/Categories");
let ScrapeController = class ScrapeController {
    async scrapePage() {
        let url = 'https://www.landingfolio.com/category/gallery/';
        let request = await requestPromise(url);
        if (!request) {
            return { error: 'Something went wrong while pinging the website.' };
        }
        let $ = cheerio.load(request);
        const categoryNames = [];
        $('div.categories-inner > ul', request).each((index, element) => {
            const categoryList = $(element);
            categoryList.each((index, element) => {
                const categoryListItem = $(element);
                const categoryList = [];
                categoryListItem.children().each((index, element) => {
                    const category = $(element).text().trim();
                    if (category !== 'Popular categories') {
                        categoryList.push(category);
                    }
                });
                categoryNames.push(categoryList);
            });
        });
        let length = $('div.col-md-4 > div.inner', request).length;
        const pages = $('.paginations .page-numbers:nth-child(5)', request).text().trim();
        let content = [];
        let categories = [];
        let images = [];
        let headings = [];
        let urls = [];
        let dates = [];
        let descriptions = [];
        for (let ii = 0; ii < parseInt(pages) + 1; ++ii) {
            if (ii >= 1) {
                url = `https://www.landingfolio.com/category/gallery/page/${ii}/`;
                request = await requestPromise(url);
                if (!request) {
                    return { error: 'Something went wrong while pinging the website.' };
                }
                length = $('div.col-md-4 > div.inner', request).length;
                $ = cheerio.load(request);
            }
            console.log(`Scraping ${url} ...`);
            for (let i = 0; i < length; ++i) {
                $('div.inner > a > div.img > img', request).each((index, element) => {
                    const image = $(element);
                    if (image) {
                        images.push(image.attr('src'));
                    }
                    else {
                        images.push('undefined');
                    }
                });
                $('div.inner > div.info > p', request).each((index, element) => {
                    const text = $(element);
                    if (text.hasClass('entry-date')) {
                        dates.push(text.text().trim());
                    }
                    else {
                        descriptions.push(text.text().trim());
                    }
                });
                $('div.inner > div.info > div.post-title > h5 > a', request).each((index, element) => {
                    const text = $(element);
                    if (text.hasClass('url')) {
                        urls.push(text.attr('href'));
                    }
                    else {
                        headings.push(text.text().trim());
                    }
                });
                $('div.inner > div.info > ul.category-list', request).each((index, element) => {
                    const categoryList = $(element);
                    categoryList.each((index, element) => {
                        const categoryListItem = $(element);
                        const categoryList = [];
                        categoryListItem.children().each((index, element) => {
                            const category = $(element).text().trim();
                            if (category !== 'Landing Page') {
                                categoryList.push(category);
                            }
                        });
                        categories.push(categoryList);
                    });
                });
                content.push({
                    date: dates[i],
                    image: images[i],
                    heading: headings[i],
                    description: descriptions[i],
                    url: urls[i],
                    categories: categories[i]
                });
                categories = [];
                images = [];
                headings = [];
                urls = [];
                dates = [];
                descriptions = [];
            }
        }
        for (let i = 0; i < categoryNames[0].length; ++i) {
            const searchCategory = await this.categoryRepository.findOne({
                category: categoryNames[0][i]
            });
            if (!searchCategory) {
                const newCategory = await this.categoryRepository.create({
                    category: categoryNames[0][i]
                });
                await this.categoryRepository.save(newCategory);
            }
        }
        for (let i = 0; i < content.length; ++i) {
            const searchContent = await this.contentRepository.findOne({
                title: content[i].heading,
                description: content[i].description,
                url: content[i].url,
                date: content[i].date
            });
            if (!searchContent) {
                const categoryArray = [];
                for (let ii = 0; ii < content[i].categories.length; ++ii) {
                    const categoryObject = await this.categoryRepository.findOne({
                        category: content[i].categories[ii]
                    });
                    if (categoryObject) {
                        categoryArray.push(categoryObject);
                    }
                }
                const newContent = await this.contentRepository.create({
                    title: content[i].heading,
                    description: content[i].description,
                    image: content[i].image,
                    url: content[i].url,
                    date: content[i].date,
                    categories: categoryArray
                });
                await this.contentRepository.save(newContent);
            }
        }
        console.log("All items have been scraped and placed in the database!");
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(Content_1.Content),
    __metadata("design:type", typeorm_1.Repository)
], ScrapeController.prototype, "contentRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(Categories_1.Categories),
    __metadata("design:type", typeorm_1.Repository)
], ScrapeController.prototype, "categoryRepository", void 0);
__decorate([
    routing_controllers_1.Get('/scrape'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ScrapeController.prototype, "scrapePage", null);
ScrapeController = __decorate([
    routing_controllers_1.Controller()
], ScrapeController);
exports.ScrapeController = ScrapeController;
//# sourceMappingURL=ScrapeController.js.map