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
const typeorm_1 = require("typeorm");
const Categories_1 = require("./Categories");
let Content = class Content {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Content.prototype, "id", void 0);
__decorate([
    typeorm_1.Column({ default: 'undefined' }),
    __metadata("design:type", String)
], Content.prototype, "title", void 0);
__decorate([
    typeorm_1.Column({ default: 'undefined' }),
    __metadata("design:type", String)
], Content.prototype, "date", void 0);
__decorate([
    typeorm_1.Column({ default: 'undefined' }),
    __metadata("design:type", String)
], Content.prototype, "url", void 0);
__decorate([
    typeorm_1.Column({ default: 'undefined' }),
    __metadata("design:type", String)
], Content.prototype, "image", void 0);
__decorate([
    typeorm_1.Column({ type: 'longtext' }),
    __metadata("design:type", String)
], Content.prototype, "description", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Content.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Content.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.ManyToMany(type => Categories_1.Categories, category => category.content),
    typeorm_1.JoinTable(),
    __metadata("design:type", Array)
], Content.prototype, "categories", void 0);
Content = __decorate([
    typeorm_1.Entity()
], Content);
exports.Content = Content;
//# sourceMappingURL=Content.js.map