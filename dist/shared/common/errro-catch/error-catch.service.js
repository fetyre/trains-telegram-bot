"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ErrorHandlerService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandlerService = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("../..");
let ErrorHandlerService = ErrorHandlerService_1 = class ErrorHandlerService {
    constructor() {
        this.logger = new common_1.Logger(ErrorHandlerService_1.name);
    }
    async handleError(error, ctx) {
        this.logger.log(`Запуск handleError, error: ${error.message}`);
        if (error instanceof shared_1.TgError) {
            await ctx.reply(error.message);
            if ('scene' in ctx) {
                await ctx.scene.leave();
            }
            return;
        }
        else if (error instanceof shared_1.MainMenu) {
            if ('scene' in ctx) {
                await ctx.scene.leave();
                await ctx.scene.enter('default');
                return;
            }
        }
        else if (error instanceof shared_1.ValidationError) {
            await ctx.reply(error.message);
            return;
        }
        this.logger.warn(`Критическая ошибка, error: ${error.message}`);
        await ctx.reply('Усп. Ошибка');
        if ('scene' in ctx) {
            await ctx.scene.leave();
        }
        return;
    }
};
exports.ErrorHandlerService = ErrorHandlerService;
exports.ErrorHandlerService = ErrorHandlerService = ErrorHandlerService_1 = __decorate([
    (0, common_1.Injectable)()
], ErrorHandlerService);
//# sourceMappingURL=error-catch.service.js.map