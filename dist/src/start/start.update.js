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
exports.StartController = void 0;
const start_service_1 = require("./start.service");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const common_1 = require("@nestjs/common");
let StartController = class StartController {
    constructor(startService) {
        this.startService = startService;
    }
    async start(ctx) {
        await ctx.scene.enter('start');
    }
    async default(ctx) {
        await ctx.scene.enter('default');
    }
    async create(ctx) {
        await ctx.scene.enter('createConsumption');
    }
    async lookConsumptionByTrain(ctx) {
        await ctx.scene.enter('lookConsumptionByTrain');
    }
    async updateRate(ctx) {
        await ctx.scene.enter('findRate');
    }
    async trainAdjustment(ctx) {
        return await this.startService.trainAdjustment(ctx);
    }
    async showActionMenu(ctx) {
        return await this.startService.showActionMenu(ctx);
    }
    async vfdvdfva(ctx) {
        return await this.startService.showTimeIntervalMenu(ctx);
    }
    async lookConsumptionWeek(ctx) {
        await ctx.scene.enter('lookConsumptionWeek');
    }
    async lookConsumptionСurrentMonth(ctx) {
        await ctx.scene.enter('lookConsumptionСurrentMonth');
    }
    async lookConsumptionLastMonth(ctx) {
        await ctx.scene.enter('lookConsumptionLastMonth');
    }
    async lookConsumptionCurrentYear(ctx) {
        await ctx.scene.enter('lookConsumptionCurrentYear');
    }
    async createTrain(ctx) {
        await ctx.scene.enter('createTrain');
        return;
    }
    async deactivateTrain(ctx) {
        await ctx.scene.enter('deactivateTrain');
        return;
    }
    async activateTrain(ctx) {
        await ctx.scene.enter('activateTrain');
        return;
    }
};
exports.StartController = StartController;
__decorate([
    (0, nestjs_telegraf_1.Start)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "start", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Главное меню'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "default", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Добавить расход'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "create", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Смотреть по поезду'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "lookConsumptionByTrain", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Корректировать рассход'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "updateRate", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Корректировка поездов.'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "trainAdjustment", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Посмотреть экономию'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "showActionMenu", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Посмотреть общую за определенный промежуток'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "vfdvdfva", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Неделя'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "lookConsumptionWeek", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Tекущий месяц'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "lookConsumption\u0421urrentMonth", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Прошлый месяц'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "lookConsumptionLastMonth", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Текущий год'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "lookConsumptionCurrentYear", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Добавить поезд.'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "createTrain", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Деактирировать поезд.'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "deactivateTrain", null);
__decorate([
    (0, nestjs_telegraf_1.Hears)('Активировать поезд.'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StartController.prototype, "activateTrain", null);
exports.StartController = StartController = __decorate([
    (0, common_1.Injectable)(),
    (0, nestjs_telegraf_1.Update)(),
    __metadata("design:paramtypes", [start_service_1.StartService])
], StartController);
//# sourceMappingURL=start.update.js.map