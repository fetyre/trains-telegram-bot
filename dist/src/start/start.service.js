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
var StartService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartService = void 0;
const common_1 = require("@nestjs/common");
const schemas_1 = require("../../schemas");
const shared_1 = require("../../shared");
const telegraf_1 = require("telegraf");
let StartService = StartService_1 = class StartService {
    constructor(userUtil, errorHandlerService) {
        this.userUtil = userUtil;
        this.errorHandlerService = errorHandlerService;
        this.logger = new common_1.Logger(StartService_1.name);
    }
    async start(ctx) {
        try {
            this.logger.log(`start: Starting process, tgId${ctx.from.id}`);
            const { id } = ctx.from;
            const tgIdString = id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            this.logger.debug(`start: User found, tgId${ctx.from.id}`);
            const arrayKeyboard = [
                ['Добавить расход'],
                ['Корректировать рассход'],
                ['Посмотреть экономию']
            ];
            this.updateUserKeyboard(user, arrayKeyboard);
            await ctx.reply(`Добро пожаловать ${user.name}`, telegraf_1.Markup.keyboard(arrayKeyboard).resize());
            this.logger.debug(`start: Finishing process, tgId${ctx.from.id}`);
            await ctx.scene.leave();
            return;
        }
        catch (error) {
            this.logger.error(`start: Error in process, tgId${ctx.from.id}, error:${error.message}`);
            if (error instanceof shared_1.TgError) {
                await ctx.reply(`${error.message}`);
                await ctx.scene.leave();
                await ctx.scene.enter('registration');
                return;
            }
            ctx.scene.reset();
        }
    }
    updateUserKeyboard(user, arrayKeyboard) {
        this.logger.log(`updateUserKeyboard: Starting process, tgId:${user.tgId}`);
        if (user.role === schemas_1.UserRole.Admin) {
            arrayKeyboard.push(['Корректировка поездов.']);
        }
    }
    async trainAdjustment(ctx) {
        try {
            this.logger.log(`trainAdjustment: Startingprocess, tgId:${ctx.from.id}.`);
            await ctx.reply('Выберите нужное действие', telegraf_1.Markup.keyboard([
                ['Добавить поезд.'],
                ['Активировать поезд.'],
                ['Деактирировать поезд.'],
                ['Главное меню']
            ]).resize());
            return;
        }
        catch (error) {
            this.logger.error(`trainAdjustment: Error in process, tgId:${ctx.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctx);
        }
    }
    async default(ctx) {
        try {
            this.logger.log(`default: Starting process, tgId${ctx.from.id}`);
            const { id } = ctx.from;
            const tgIdString = id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            this.logger.debug(`default: User found, tgId${ctx.from.id}`);
            const arrayKeyboard = [
                ['Добавить расход'],
                ['Корректировать рассход'],
                ['Посмотреть экономию']
            ];
            this.updateUserKeyboard(user, arrayKeyboard);
            await ctx.reply(`Выберете действие:`, telegraf_1.Markup.keyboard(arrayKeyboard).resize());
            this.logger.debug(`default: Finishing process, tgId${ctx.from.id}`);
            await ctx.scene.leave();
            return;
        }
        catch (error) {
            this.logger.error(`default: Error in process, tgId${ctx.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctx);
        }
    }
    async showActionMenu(ctx) {
        try {
            this.logger.log(`showActionMenu: Starting process, tgId${ctx.from.id}`);
            await ctx.reply('Выберите нужное действие', telegraf_1.Markup.keyboard([
                ['Посмотреть общую за определенный промежуток', 'Смотреть по поезду'],
                ['Главное меню']
            ]).resize());
            return;
        }
        catch (error) {
            this.logger.error(`showActionMenu: Error in process, tgId${ctx.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctx);
        }
    }
    async showTimeIntervalMenu(ctx) {
        try {
            this.logger.log(`showTimeIntervalMenu: Starting process, tgId${ctx.from.id}`);
            await ctx.reply('Выберите промежуток', telegraf_1.Markup.keyboard([
                ['Неделя', 'Tекущий месяц'],
                ['Прошлый месяц', 'Текущий год'],
                ['Главное меню']
            ]).resize());
            return;
        }
        catch (error) {
            this.logger.error(`showTimeIntervalMenu: Error in process, tgId${ctx.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctx);
        }
    }
};
exports.StartService = StartService;
exports.StartService = StartService = StartService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [shared_1.UserUtil,
        shared_1.ErrorHandlerService])
], StartService);
//# sourceMappingURL=start.service.js.map