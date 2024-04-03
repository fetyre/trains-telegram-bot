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
exports.LookConsumptionByTrain = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const consumption_service_1 = require("../consumption.service");
let LookConsumptionByTrain = class LookConsumptionByTrain {
    constructor(consumptionService) {
        this.consumptionService = consumptionService;
    }
    async enter(ctxScene, ctx) {
        return await this.consumptionService.createConsumption(ctxScene, ctx);
    }
    async onText(ctxScene) {
        return await this.consumptionService.lookConsumptionByTrain(ctxScene, this.consumptionService.sumTotalConsumption);
    }
};
exports.LookConsumptionByTrain = LookConsumptionByTrain;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __param(1, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LookConsumptionByTrain.prototype, "enter", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LookConsumptionByTrain.prototype, "onText", null);
exports.LookConsumptionByTrain = LookConsumptionByTrain = __decorate([
    (0, common_1.Injectable)(),
    (0, nestjs_telegraf_1.Scene)('lookConsumptionByTrain'),
    __metadata("design:paramtypes", [consumption_service_1.ConsumptionService])
], LookConsumptionByTrain);
//# sourceMappingURL=consumption-look-by-train.scene.js.map