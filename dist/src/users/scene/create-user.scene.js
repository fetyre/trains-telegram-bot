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
exports.RegistrationScene = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const users_service_1 = require("../users.service");
let RegistrationScene = class RegistrationScene {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async enter(ctx) {
        return await this.usersService.checkCreate(ctx);
    }
    async onText(ctx) {
        return await this.usersService.create(ctx);
    }
};
exports.RegistrationScene = RegistrationScene;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegistrationScene.prototype, "enter", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RegistrationScene.prototype, "onText", null);
exports.RegistrationScene = RegistrationScene = __decorate([
    (0, nestjs_telegraf_1.Scene)('registration'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], RegistrationScene);
//# sourceMappingURL=create-user.scene.js.map