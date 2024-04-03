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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./user.repository");
const shared_1 = require("../../shared");
const typescript_optional_1 = require("typescript-optional");
const NameRegExp = /^[а-яА-ЯёЁa-zA-ZуўеёыайцукенгшўзхфівапролджэячсмитьбюУЎЕЁЫАЙЦУКЕНГШЎЗХФІВАПРОЛДЖЭЯЧСМІТЬБЮ\s]+$/;
const NameMinLeng = 2;
const NameMaxLeng = 50;
let UsersService = class UsersService extends shared_1.BaseClass {
    constructor(usersRepository, errorHandlerService) {
        super();
        this.usersRepository = usersRepository;
        this.errorHandlerService = errorHandlerService;
    }
    async checkCreate(ctx) {
        try {
            this.logger.log(`checkCreate: Starting process, tgId:${ctx.from.id}`);
            const { id } = ctx.from;
            const tgIdString = id.toString();
            this.logger.debug(`checkCreate: id made string`);
            await this.checkUserExistence(tgIdString);
            this.logger.debug(`checkCreate: user not found`);
            await ctx.reply('Пожалуйста, введите ваше имя👀');
            return;
        }
        catch (error) {
            this.logger.error(`checkCreate: Error in process, tgId:${ctx.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctx);
        }
    }
    async checkUserExistence(tgIdString) {
        typescript_optional_1.Optional.ofNullable(await this.usersRepository.findUserByTgId(tgIdString)).ifPresent(() => new shared_1.TgError(`Вы уже зарегистрированы🙃`));
    }
    async create(ctx) {
        try {
            this.logger.log(`create: Starting process, tgId:${ctx.from.id}`);
            const name = this.extractTextFromContext(ctx);
            const validateName = this.validateText(name, NameRegExp, NameMinLeng, NameMaxLeng);
            this.logger.debug(`create: Validated name, tgId:${ctx.from.id}, name:${name}`);
            const tgIdString = ctx.from.id.toString();
            await this.usersRepository.createUser(name, tgIdString, validateName);
            this.logger.log(`create: User created, tgId:${ctx.from.id}, name:${name}`);
            await ctx.reply('Регистрация завершена✅');
            await ctx.reply('Спасибо за регистрацию! Пожалуйста, ознакомьтесь с нашими Условиями использования перед началом работы:\n\n' +
                '1. Везде можете использовать Клавиатуру и выбирать нужные данные.\n' +
                '   Где предоставлена клавиатура и вы вводите свои данные, ничего не будет происходить!\n' +
                '2. Где от вас требуется ввод, вводите корректные данные: \n' +
                '   Количество вагонов принимается формат как N так и N+N,\n' +
                '   в спалили/норма требуется жесткий формат N');
            await ctx.scene.enter('default');
            return;
        }
        catch (error) {
            this.logger.error(`create: Error in process, tgId:${ctx.from.id}, error:${error.message}`);
            await ctx.reply(`${error.message}`);
            ctx.scene.reset();
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UsersRepository,
        shared_1.ErrorHandlerService])
], UsersService);
//# sourceMappingURL=users.service.js.map