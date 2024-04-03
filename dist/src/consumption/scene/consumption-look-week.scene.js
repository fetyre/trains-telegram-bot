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
exports.LookConsumptionWeek = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const consumption_service_1 = require("../consumption.service");
let LookConsumptionWeek = class LookConsumptionWeek {
    constructor(consumptionService) {
        this.consumptionService = consumptionService;
    }
    async enter(ctxScene) {
        return await this.consumptionService.getConsumption(ctxScene, this.consumptionService.dateCurrentWeek);
    }
};
exports.LookConsumptionWeek = LookConsumptionWeek;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LookConsumptionWeek.prototype, "enter", null);
exports.LookConsumptionWeek = LookConsumptionWeek = __decorate([
    (0, common_1.Injectable)(),
    (0, nestjs_telegraf_1.Scene)('lookConsumptionWeek'),
    __metadata("design:paramtypes", [consumption_service_1.ConsumptionService])
], LookConsumptionWeek);
//# sourceMappingURL=consumption-look-week.scene.js.map