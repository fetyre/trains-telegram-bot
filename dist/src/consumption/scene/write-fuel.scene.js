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
exports.WriteFuelScene = void 0;
const common_1 = require("@nestjs/common");
const consumption_service_1 = require("../consumption.service");
const nestjs_telegraf_1 = require("nestjs-telegraf");
let WriteFuelScene = class WriteFuelScene {
    constructor(consumptionService) {
        this.consumptionService = consumptionService;
    }
    async enter(ctx, ctxScene) {
        return await this.consumptionService.writeFuel(ctx, ctxScene);
    }
    async onText(ctx, ctxScene) {
        return await this.consumptionService.checkFuel(ctx, ctxScene);
    }
};
exports.WriteFuelScene = WriteFuelScene;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __param(1, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WriteFuelScene.prototype, "enter", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __param(1, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WriteFuelScene.prototype, "onText", null);
exports.WriteFuelScene = WriteFuelScene = __decorate([
    (0, common_1.Injectable)(),
    (0, nestjs_telegraf_1.Scene)('writeFuel'),
    __metadata("design:paramtypes", [consumption_service_1.ConsumptionService])
], WriteFuelScene);
//# sourceMappingURL=write-fuel.scene.js.map