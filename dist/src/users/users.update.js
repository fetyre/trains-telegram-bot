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
exports.UsersUpdate = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const users_service_1 = require("./users.service");
let UsersUpdate = class UsersUpdate {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async onStart(ctx) {
        await ctx.scene.enter('registration');
    }
};
exports.UsersUpdate = UsersUpdate;
__decorate([
    (0, nestjs_telegraf_1.Command)('newuser'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersUpdate.prototype, "onStart", null);
exports.UsersUpdate = UsersUpdate = __decorate([
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersUpdate);
//# sourceMappingURL=users.update.js.map