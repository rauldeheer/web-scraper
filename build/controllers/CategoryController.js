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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const typeorm_typedi_extensions_1 = require("typeorm-typedi-extensions");
const typeorm_1 = require("typeorm");
const Categories_1 = require("../entities/Categories");
const Content_1 = require("../entities/Content");
let CategoryController = class CategoryController {
    async getAll() {
        const categories = await this.categoryRepository.findAndCount();
        if (!categories) {
            return { success: false, error: 'Something went wrong while getting the categories' };
        }
        return { success: true, total: categories[1], categories: categories[0] };
    }
    async getOne(uuid) {
        const category = await this.categoryRepository.createQueryBuilder("category").leftJoinAndSelect("category.content", "content").andWhere("category.id = :uuid", { uuid: uuid }).getOne();
        if (!category) {
            return { success: false, error: 'Something went wrong while getting the category with content' };
        }
        return { success: true, category: category };
    }
    async getByCategory() {
        const category = await this.categoryRepository.createQueryBuilder("category").leftJoinAndSelect("category.content", "content").getMany();
        if (!category) {
            return { success: false, error: 'Something went wrong while getting the categories with content' };
        }
        return { success: true, category: category };
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(Categories_1.Categories),
    __metadata("design:type", typeorm_1.Repository)
], CategoryController.prototype, "categoryRepository", void 0);
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(Content_1.Content),
    __metadata("design:type", typeorm_1.Repository)
], CategoryController.prototype, "contentRepository", void 0);
__decorate([
    routing_controllers_1.Get('/categories'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getAll", null);
__decorate([
    routing_controllers_1.Get('/categories/content/:uuid'),
    __param(0, routing_controllers_1.Param('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getOne", null);
__decorate([
    routing_controllers_1.Get('/categories/content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoryController.prototype, "getByCategory", null);
CategoryController = __decorate([
    routing_controllers_1.Controller()
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=CategoryController.js.map