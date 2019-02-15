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
const Content_1 = require("../entities/Content");
let ContentController = class ContentController {
    async getAll() {
        const content = await this.contentRepository.findAndCount({ relations: ['categories'] });
        if (!content) {
            return { success: false, error: 'Something went wrong while getting the content' };
        }
        return { success: true, total: content[1], content: content[0] };
    }
    async getOne(uuid) {
        const content = await this.contentRepository.findOne(uuid);
        if (!content) {
            return { success: false, error: 'No content with this ID was found' };
        }
        return { success: true, content: content };
    }
};
__decorate([
    typeorm_typedi_extensions_1.InjectRepository(Content_1.Content),
    __metadata("design:type", typeorm_1.Repository)
], ContentController.prototype, "contentRepository", void 0);
__decorate([
    routing_controllers_1.Get('/content'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getAll", null);
__decorate([
    routing_controllers_1.Get('/content/:uuid'),
    __param(0, routing_controllers_1.Param('uuid')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContentController.prototype, "getOne", null);
ContentController = __decorate([
    routing_controllers_1.Controller()
], ContentController);
exports.ContentController = ContentController;
//# sourceMappingURL=ContentController.js.map