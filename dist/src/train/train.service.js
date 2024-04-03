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
exports.TrainService = void 0;
const common_1 = require("@nestjs/common");
const train_repository_1 = require("./train.repository");
const telegraf_1 = require("telegraf");
const shared_1 = require("../../shared");
const typescript_optional_1 = require("typescript-optional");
const schemas_1 = require("../../schemas");
let TrainService = class TrainService extends shared_1.BaseClass {
    constructor(trainRepository, errorHandlerService, trainUtil, userUtil) {
        super();
        this.trainRepository = trainRepository;
        this.errorHandlerService = errorHandlerService;
        this.trainUtil = trainUtil;
        this.userUtil = userUtil;
    }
    async checkCreate(ctx) {
        this.logger.log(`checkCreate: Starting process, tgId:${ctx.from.id}`);
        try {
            const tgIdString = ctx.from.id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            this.checkUserRole(user);
            await ctx.reply('Пожалуйста введите номер поезда 🙄');
            this.logger.debug(`checkCreate: User role checked, tgId:${ctx.from.id}`);
            return;
        }
        catch (error) {
            this.logger.error(`checkCreate: Error occurred, tgId:${ctx.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctx);
        }
    }
    checkUserRole(user) {
        this.logger.log(`checkUserRole: Starting process, user role:${user.role}`);
        if (user.role !== schemas_1.UserRole.Admin) {
            throw new shared_1.TgError('Ошибка доступа🤨');
        }
    }
    async create(ctxScene) {
        this.logger.log(`create: Starting process, tgId:${ctxScene.from.id}`);
        try {
            this.mainMenu(ctxScene);
            const trainNumber = this.extractTextFromContext(ctxScene);
            const validTrainNumber = this.validateText(trainNumber, shared_1.TrainNumberRegExp, shared_1.TrainNumberMinLeng, shared_1.TrainNumberMaxLeng);
            await this.checkTrainExistence(validTrainNumber);
            await this.trainRepository.saveTrain(validTrainNumber);
            await ctxScene.reply('Поезд успешно создан🚂');
            await ctxScene.scene.enter('default');
            this.logger.debug(`create: Train created, tgId:${ctxScene.from.id}`);
            return;
        }
        catch (error) {
            this.logger.error(`create: Error occurred, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async checkTrainExistence(trainNumber) {
        typescript_optional_1.Optional.ofNullable(await this.trainRepository.findTrainByNumber(trainNumber)).ifPresent(() => new shared_1.TgError(`Поезд с таким именем уже существует 🧐`));
        this.logger.log(`checkTrainExistence: Starting process, trainNumber:${trainNumber}`);
    }
    async displayActiveTrains(ctxScene) {
        try {
            this.logger.log(`displayActiveTrains: Starting process, tgId:${ctxScene.from.id}`);
            this.mainMenu(ctxScene);
            const tgIdString = ctxScene.from.id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            this.checkUserRole(user);
            const activeTrains = await this.trainRepository.findManyTrains(true);
            this.logger.debug(`displayActiveTrains: Fetched active trains, count: ${activeTrains.length}`);
            const group = this.groupTrainsInPairs(activeTrains);
            group.push(['Главное меню']);
            await ctxScene.reply(`Выберите номер поезда из активных ниже 🧜‍♀️`, telegraf_1.Markup.keyboard(group).resize());
            this.logger.log(`displayActiveTrains: Process completed, tgId:${ctxScene.from.id}`);
        }
        catch (error) {
            this.logger.error(`displayActiveTrains: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async deactivateTrain(ctxScene) {
        try {
            this.logger.log(`deactivateTrain: Starting process, tgId:${ctxScene.from.id}`);
            this.mainMenu(ctxScene);
            const trainNumber = this.extractTextFromContext(ctxScene);
            const validTrainNumber = this.validateText(trainNumber, shared_1.TrainNumberRegExp, shared_1.TrainNumberMinLeng, shared_1.TrainNumberMaxLeng);
            const train = await this.trainUtil.findTrainByNumber(validTrainNumber);
            this.checkTrainStatusInactive(train);
            await this.trainRepository.updateTrainStatus(train, false);
            this.logger.log(`deactivateTrain: Process completed, tgId:${ctxScene.from.id}`);
            await ctxScene.reply('Поезд успешно деактивирвоан 😎');
            await ctxScene.scene.enter('default');
        }
        catch (error) {
            this.logger.error(`deactivateTrain: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    checkTrainStatusActive(train) {
        this.logger.log(`checkTrainStatusActive: Starting process, trainNumber:${train.trainNumber}`);
        if (train.isActive === true) {
            this.logger.debug(`checkTrainStatusActive: Train is already active, trainNumber:${train.trainNumber}`);
            throw new shared_1.TgError('Поезд уже активирован 🥺');
        }
    }
    async displayInactiveTrains(ctxScene) {
        try {
            this.logger.log(`displayInactiveTrains: Starting process, tgId:${ctxScene.from.id}`);
            this.mainMenu(ctxScene);
            const tgIdString = ctxScene.from.id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            this.checkUserRole(user);
            const deactiveTrains = await this.trainRepository.findManyTrains(false);
            this.logger.debug(`displayInactiveTrains: Fetched inactive trains, count: ${deactiveTrains.length}`);
            const group = this.groupTrainsInPairs(deactiveTrains);
            group.push(['Главное меню']);
            await ctxScene.reply(`Выберите номер поезда из некативных ниже, который вы хотите активировать 🧜‍♀️`, telegraf_1.Markup.keyboard(group).resize());
            this.logger.log(`displayInactiveTrains: Process completed, tgId:${ctxScene.from.id}`);
            return;
        }
        catch (error) {
            this.logger.error(`displayInactiveTrains: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async activateTrain(ctxScene) {
        try {
            this.mainMenu(ctxScene);
            this.logger.log(`activateTrain: Starting process, tgId:${ctxScene.from.id}`);
            const trainNumber = this.extractTextFromContext(ctxScene);
            this.validateText(trainNumber, shared_1.TrainNumberRegExp, shared_1.TrainNumberMinLeng, shared_1.TrainNumberMaxLeng);
            const train = await this.trainUtil.findTrainByNumber(trainNumber);
            this.checkTrainStatusActive(train);
            await this.trainRepository.updateTrainStatus(train, true);
            this.logger.log(`activateTrain: Process completed, tgId:${ctxScene.from.id}`);
            await ctxScene.reply('Поезд активирован 😎');
            await ctxScene.scene.enter('default');
            return;
        }
        catch (error) {
            this.logger.error(`activateTrain: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
};
exports.TrainService = TrainService;
exports.TrainService = TrainService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [train_repository_1.TrainRepository,
        shared_1.ErrorHandlerService,
        shared_1.TrainUtil,
        shared_1.UserUtil])
], TrainService);
//# sourceMappingURL=train.service.js.map