import { Controller, Get } from 'routing-controllers';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { Repository } from 'typeorm';
import * as requestPromise from 'request-promise';
import * as cheerio from 'cheerio';

import { Content } from '../entities/Content';
import { Categories } from '../entities/Categories';

@Controller()
export class ScrapeController {
  @InjectRepository(Content)
  private contentRepository!: Repository<Content>;

  @InjectRepository(Categories)
  private categoryRepository!: Repository<Categories>;

  @Get('/scrape')
  public async scrapePage() {
    let url = 'https://www.landingfolio.com/category/gallery/';
    let request = await requestPromise(url);

    if (!request) {
      return { error: 'Something went wrong while pinging the website.' };
    }

    let $ = cheerio.load(request);

    const categoryNames: Array<any> = [];

    $('div.categories-inner > ul', request).each((index, element) => {
      const categoryList = $(element);

      categoryList.each((index, element) => {
        const categoryListItem = $(element);
        const categoryList: Array<string> = [];

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

    let content: Array<object> = [];
    let categories: Array<any> = [];
    let images: Array<string> = [];
    let headings: Array<string> = [];
    let urls: Array<string> = [];
    let dates: Array<string> = [];
    let descriptions: Array<string> = [];

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
          } else {
            images.push('undefined');
          }
        });

        $('div.inner > div.info > p', request).each((index, element) => {
          const text = $(element);

          if (text.hasClass('entry-date')) {
            dates.push(text.text().trim());
          } else {
            descriptions.push(text.text().trim());
          }
        });

        $('div.inner > div.info > div.post-title > h5 > a', request).each((index, element) => {
          const text = $(element);

          if (text.hasClass('url')) {
            urls.push(text.attr('href'));
          } else {
            headings.push(text.text().trim());
          }
        });

        $('div.inner > div.info > ul.category-list', request).each((index, element) => {
          const categoryList = $(element);

          categoryList.each((index, element) => {
            const categoryListItem = $(element);
            const categoryList: Array<string> = [];

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

      if(!searchCategory) {
        const newCategory = await this.categoryRepository.create({
          category: categoryNames[0][i]
        });

        await this.categoryRepository.save(newCategory);
      }
    }

    for (let i = 0; i < content.length; ++i) {
      const searchContent = await this.contentRepository.findOne({
        // @ts-ignore
        title: content[i].heading,
        // @ts-ignore
        description: content[i].description,
        // @ts-ignore
        url: content[i].url,
        // @ts-ignore
        date: content[i].date
      });

      if(!searchContent) {
        const categoryArray: Array<any> = [];

        // @ts-ignore
        for (let ii = 0; ii < content[i].categories.length; ++ii) {
          const categoryObject = await this.categoryRepository.findOne({
            // @ts-ignore
            category: content[i].categories[ii]
          });

          if(categoryObject) {
            categoryArray.push(categoryObject);
          }
        }

        const newContent = await this.contentRepository.create({
          // @ts-ignore
          title: content[i].heading,
          // @ts-ignore
          description: content[i].description,
          // @ts-ignore
          image: content[i].image,
          // @ts-ignore
          url: content[i].url,
          // @ts-ignore
          date: content[i].date,
          categories: categoryArray
        });

        await this.contentRepository.save(newContent);
      }
    }

    console.log("All items have been scraped and placed in the database!");
  }
}

