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
exports.ConsumptionService = void 0;
const common_1 = require("@nestjs/common");
const train_repository_1 = require("../train/train.repository");
const telegraf_1 = require("telegraf");
const consumption_repository_1 = require("./consumption.repository");
const moment = require("moment-timezone");
const shared_1 = require("../../shared");
const typescript_optional_1 = require("typescript-optional");
const CarrigeRegExp = /^[0-9]{1,2}(\s?[+-]\s?[0-9]{1,2})*$/;
const CarrigeMinLeng = 1;
const CarrigeMaxLeng = 6;
const FuelNumberRegExp = /^[0-9\S]*$/;
const FuelNumberMinLeng = 1;
const FuelNumberMaxLeng = 4;
const RateRegExp = /^Поезд № (\d{1,4}[а-яА-Я]?) от (\d{2}-\d{2}-\d{4})$/;
const RateMinLeng = 23;
const RateMaxLeng = 30;
const BurntFuelRegExp = /^\d+$/;
const BurntFuelMinLeng = 1;
const BurntFuelMaxLeng = 5;
let ConsumptionService = class ConsumptionService extends shared_1.BaseClass {
    constructor(trainRepository, errorHandlerService, consumptionRepository, trainUtil, userUtil) {
        super();
        this.trainRepository = trainRepository;
        this.errorHandlerService = errorHandlerService;
        this.consumptionRepository = consumptionRepository;
        this.trainUtil = trainUtil;
        this.userUtil = userUtil;
    }
    async createConsumption(ctxScene, ctx) {
        try {
            this.logger.log(`createConsumption: Starting process, tgId:${ctxScene.from.id}`);
            const activeTrains = await this.trainRepository.findManyTrains(true);
            this.logger.debug(`createConsumption: Fetched active trains, count: ${activeTrains.length}, tgId:${ctxScene.from.id}`);
            const group = this.groupTrainsInPairs(activeTrains);
            this.logger.debug(`createConsumption: sorted completed, tgId:${ctxScene.from.id}`);
            group.push(['Главное меню']);
            await ctxScene.reply(`Выберите номер поезда из активных ниже `, telegraf_1.Markup.keyboard(group).resize());
            this.logger.debug(`createConsumption: finish process, tgId:${ctxScene.from.id}`);
        }
        catch (error) {
            this.logger.error(`default: Error in process, tgId${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async checkTrainNumberByConsumption(ctxScene, ctx) {
        try {
            this.logger.log(`checkTrainNumberByConsumption: Starting process, tgId:${ctxScene.from.id}`);
            this.mainMenu(ctxScene);
            const trainNumber = this.extractTextFromContext(ctxScene);
            this.validateText(trainNumber, shared_1.TrainNumberRegExp, shared_1.TrainNumberMinLeng, shared_1.TrainNumberMaxLeng);
            this.logger.log(`checkTrainNumberByConsumption: Train number in valid, tgId:${ctxScene.from.id}`);
            const train = await this.trainUtil.findTrainByNumber(trainNumber);
            this.logger.log(`checkTrainNumberByConsumption: Train search completed, tgId:${ctxScene.from.id}`);
            this.checkTrainStatusInactive(train);
            ctx.session.trip.trainNumber = trainNumber;
            await ctxScene.scene.enter('writeCarrige');
            this.logger.debug(`checkTrainNumberByConsumption: finish process, tgId:${ctxScene.from.id}`);
        }
        catch (error) {
            this.logger.error(`checkTrainNumberByConsumption: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async writeCarrige(ctx, ctxScene) {
        try {
            this.logger.log(`writeCarrige: Starting process, tgId: ${ctxScene.from.id}.`);
            this.mainMenu(ctxScene);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            await ctxScene.reply('Введите количество вагонов', telegraf_1.Markup.keyboard(['Главное меню']).oneTime().resize());
            this.logger.debug(`writeCarrige: finish process, tgId:${ctxScene.from.id}`);
        }
        catch (error) {
            this.logger.error(`writeCarrige: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    checkParamsInSession(params) {
        this.logger.log(`checkParamsInSession: Starting process.`);
        if (!params) {
            this.logger.debug(`checkParamsInSession: session dosen't have params.`);
            throw new shared_1.TgError('Ошибка запроса');
        }
    }
    async checkCarrige(ctx, ctxScene) {
        try {
            this.logger.log(`checkCarrige: Starting process, tgId: ${ctxScene.from.id}.`);
            this.mainMenu(ctxScene);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            const carrige = this.extractTextFromContext(ctxScene);
            const validCarrige = this.validateText(carrige, CarrigeRegExp, CarrigeMinLeng, CarrigeMaxLeng);
            const formattedCarriage = this.tgtg(validCarrige);
            this.logger.debug(`checkCarrige: carrige valid, tgId: ${ctxScene.from.id}.`);
            ctx.session.trip.carriage = formattedCarriage;
            await ctxScene.scene.enter('writeFuel');
            this.logger.debug(`checkCarrige: finish process, tgId:${ctxScene.from.id}`);
        }
        catch (error) {
            this.logger.error(`checkCarrige: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    tgtg(carrige) {
        this.logger.log(`tgtg: Starting process.`);
        return carrige.replace(/\s/g, '');
    }
    async writeFuel(ctx, ctxScene) {
        try {
            this.logger.log(`writeFuel: Starting process, tgId: ${ctxScene.from.id}.`);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            this.checkParamsInSession(ctx.session.trip.carriage);
            await ctxScene.reply(`Введите количество топлива`, telegraf_1.Markup.keyboard(['Главное меню']).resize());
            this.logger.debug(`writeFuel: finish process, tgId: ${ctxScene.from.id}.`);
        }
        catch (error) {
            this.logger.error(`checkCarrige: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async checkFuel(ctx, ctxScene) {
        try {
            this.logger.log(`checkFuel: Starting process, tgId: ${ctxScene.from.id}.`);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            this.checkParamsInSession(ctx.session.trip.carriage);
            const fuel = this.extractTextFromContext(ctxScene);
            const validFuel = this.validateText(fuel, FuelNumberRegExp, FuelNumberMinLeng, FuelNumberMaxLeng);
            ctx.session.trip.fuel = validFuel;
            await ctxScene.scene.enter(`checkDescr`);
            this.logger.debug(`checkFuel: finish process, tgId: ${ctxScene.from.id}.`);
        }
        catch (error) {
            this.logger.error(`checkFuel: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async enterCheckDescription(ctx, ctxScene) {
        try {
            this.logger.log(`enterCheckDescription: Starting process, tgId: ${ctxScene.from.id}.`);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            this.checkParamsInSession(ctx.session.trip.carriage);
            this.checkParamsInSession(ctx.session.trip.fuel);
            await ctxScene.reply(`Хотите ли добавить примечание?`, telegraf_1.Markup.keyboard([['да'], ['нет'], ['Главное меню']]).resize());
            this.logger.debug(`enterCheckDescription: finish process, tgId: ${ctxScene.from.id}.`);
        }
        catch (error) {
            this.logger.error(`enterCheckDescription: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async handleCheckDescriptionInput(ctx, ctxScene) {
        try {
            this.logger.log(`handleCheckDescriptionInput: Starting process, tgId: ${ctxScene.from.id}.`);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            this.checkParamsInSession(ctx.session.trip.carriage);
            this.checkParamsInSession(ctx.session.trip.fuel);
            const choice = this.extractTextFromContext(ctxScene);
            if (choice === 'да') {
                return await this.handleYesChoice(ctxScene, ctx);
            }
            else if ('нет') {
                return await this.handleNoChoice(ctxScene, ctx);
            }
            else {
                this.logger.debug(`handleCheckDescriptionInput: error in text, tgId: ${ctxScene.from.id}.`);
                throw new shared_1.TgError('Неверный вариант ответа');
            }
        }
        catch (error) {
            this.logger.error(`handleCheckDescriptionInput: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async handleYesChoice(ctxScene, ctx) {
        await ctxScene.scene.enter('writeDescr');
        this.logger.debug(`handleYesChoice: finish process, tgId: ${ctxScene.from.id}.`);
    }
    async handleNoChoice(ctxScene, ctx) {
        const tgIdString = ctxScene.from.id.toString();
        const train = await this.trainUtil.findTrainByNumber(ctx.session.trip.trainNumber);
        const user = await this.userUtil.getUserById(tgIdString);
        await this.consumptionRepository.createConsumption({
            trainNumber: ctx.session.trip.trainNumber,
            carriage: ctx.session.trip.carriage,
            fuel: ctx.session.trip.fuel
        }, train, user);
        const fuelDifference = await this.calculateFuelDifference(train, user, ctx.session.trip.carriage, ctx.session.trip.fuel);
        this.logger.debug(`handleNoChoice: create consumption, tgId: ${ctxScene.from.id}.`);
        await ctxScene.reply('Зaпись создна');
        await this.displayExpectedResult(fuelDifference, ctxScene);
        await ctxScene.scene.enter('default');
        this.logger.debug(`handleNoChoice: finish process, tgId: ${ctxScene.from.id}.`);
    }
    async displayExpectedResult(fuelDifference, ctxScene) {
        this.logger.log(`displayExpectedResult: Starting process, tgId:${ctxScene.from.id}.`);
        if (fuelDifference) {
            await ctxScene.reply(`Ожидаемый резульат: ${fuelDifference}`);
        }
    }
    async calculateFuelDifference(train, user, carriage, fuel) {
        this.logger.log(`calculateFuelDifference: Starting process, userId:${user._id}.`);
        if (carriage.includes('+')) {
            return await this.calculateFuelDifferenceWithPlus(train, user, carriage, fuel);
        }
        return await this.calculateFuelDifferenceGeneral(train, user, carriage, fuel);
    }
    async calculateAverageNorm(consumptions) {
        this.logger.log(`calculateAverageNorm: Starting process.`);
        if (consumptions && consumptions.length > 0) {
            const norms = consumptions.map(c => parseFloat(c.norm));
            const averageNorm = norms.reduce((a, b) => a + b) / norms.length;
            return averageNorm.toString();
        }
        return null;
    }
    async calculateFuelDifferenceWithPlus(train, user, carriage, fuel) {
        this.logger.log(`calculateFuelDifferenceWithPlus: Starting process, userId:${user._id}.`);
        const total = eval(carriage).toString();
        const [consumption1, consumption2] = await Promise.all([
            this.consumptionRepository.findLatestConsumptionsByExactCarriage(user, train.trainNumber, total),
            this.consumptionRepository.findLatestConsumptionsByExactCarriage(user, train.trainNumber, carriage)
        ]);
        const combinedConsumptions = consumption1.concat(consumption2);
        const averageNorm = await this.calculateAverageNorm(combinedConsumptions);
        return averageNorm
            ? (parseFloat(averageNorm) - parseFloat(fuel)).toString()
            : null;
    }
    async calculateFuelDifferenceGeneral(train, user, carriage, fuel) {
        this.logger.log(`calculateFuelDifferenceGeneral: Starting process, userId:${user._id}.`);
        const consumptions = await this.consumptionRepository.findLatestConsumptionsByCarriage(user, train.trainNumber, carriage);
        const averageNorm = await this.calculateAverageNorm(consumptions);
        return averageNorm
            ? (parseFloat(averageNorm) - parseFloat(fuel)).toString()
            : null;
    }
    async enterWriteDescription(ctx, ctxScene) {
        try {
            this.logger.log(`enterWriteDescription: Starting process, tgId: ${ctxScene.from.id}.`);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            this.checkParamsInSession(ctx.session.trip.carriage);
            this.checkParamsInSession(ctx.session.trip.fuel);
            await ctxScene.reply(`Введите примечание`);
            this.logger.debug(`handleWriteDescriptionInput: finish process, tgId: ${ctxScene.from.id}.`);
        }
        catch (error) {
            this.logger.error(`enterWriteDescription: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async handleWriteDescriptionInput(ctx, ctxScene) {
        try {
            this.logger.log(`handleWriteDescriptionInput: Starting process, tgId: ${ctxScene.from.id}.`);
            this.checkParamsInSession(ctx.session.trip.trainNumber);
            this.checkParamsInSession(ctx.session.trip.carriage);
            this.checkParamsInSession(ctx.session.trip.fuel);
            const descr = this.extractTextFromContext(ctxScene);
            const tgIdString = ctxScene.from.id.toString();
            const train = await this.trainUtil.findTrainByNumber(ctx.session.trip.trainNumber);
            const user = await this.userUtil.getUserById(tgIdString);
            await this.consumptionRepository.createConsumption({
                trainNumber: ctx.session.trip.trainNumber,
                carriage: ctx.session.trip.carriage,
                fuel: ctx.session.trip.fuel,
                descr
            }, train, user);
            this.logger.debug(`handleWriteDescriptionInput: create consumption, tgId: ${ctxScene.from.id}.`);
            await ctxScene.reply('Зaпись создна');
            await ctxScene.scene.enter('default');
            this.logger.debug(`handleWriteDescriptionInput: finish process, tgId: ${ctxScene.from.id}.`);
            return;
        }
        catch (error) {
            this.logger.error(`handleWriteDescriptionInput: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async getConsumption(ctxScene, dateRange, totalConsumption) {
        try {
            this.logger.log(`getConsumption: Starting process, tgId: ${ctxScene.from.id}.`);
            const [start, end] = dateRange();
            const tgIdString = ctxScene.from.id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            const consumptions = await this.consumptionRepository.getConsumptionsForTimeRangeByUser(start, user._id, end);
            this.logger.debug(`getConsumption: searched completed, tgId: ${ctxScene.from.id}.`);
            return await this.sendConsumptions(ctxScene, consumptions, totalConsumption);
        }
        catch (error) {
            this.logger.error(`getConsumption: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    formattedConsumptions(consumptions) {
        this.logger.log(`formattedConsumptions: Starting process.`);
        return consumptions.map(consumption => {
            const parts = [
                `${this.formatDateInTimeZone(consumption.createdAt)}| поезд: №${consumption.trainNumber} | вагонов: ${consumption.carriage} | спалил: ${consumption.fuel}`,
                consumption.norm && `| норма: ${consumption.norm}`,
                consumption.economy && `| экономия: ${consumption.economy}`,
                consumption.descr && `| ${consumption.descr}`
            ];
            return parts.reduce((result, part) => (part ? result + part : result), '');
        });
    }
    formatDateInTimeZone(date) {
        this.logger.log(`formatDateInTimeZone: Starting process.`);
        return moment(date).tz('Europe/Minsk').format('DD-MM');
    }
    datesLastMonth() {
        const date = new Date();
        const firstDayOfLastMonth = new Date(date.getFullYear(), date.getMonth() - 1, 1);
        const lastDayOfLastMonth = new Date(date.getFullYear(), date.getMonth(), 0);
        return [firstDayOfLastMonth, lastDayOfLastMonth];
    }
    dateFirtDayInCurrentMonth() {
        const date = new Date();
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        return [firstDayOfMonth];
    }
    dateCurrentWeek() {
        const date = new Date();
        const startOfYear = new Date(date.getFullYear(), 0, 1);
        return [startOfYear];
    }
    dateCurrentYear() {
        const date = new Date();
        const oneWeekAgo = new Date(date.getDate() - 7);
        return [oneWeekAgo];
    }
    sumTotalConsumption(consumptions) {
        return consumptions.reduce((sum, consumption) => {
            return consumption.economy && consumption.norm
                ? sum + consumption.economy
                : sum;
        }, 0);
    }
    async sendConsumptions(ctxScene, consumptions, totalConsumption) {
        if (!consumptions.length) {
            await ctxScene.reply('Нет данных');
            await ctxScene.scene.enter('default');
            return;
        }
        const formattedConsumptions = this.formattedConsumptions(consumptions);
        const sumRate = totalConsumption?.(consumptions);
        sumRate
            ? formattedConsumptions.push(`Общая экономия: ${sumRate}`)
            : formattedConsumptions;
        await ctxScene.reply(formattedConsumptions.join('\n\n'));
        await ctxScene.scene.enter('default');
        this.logger.debug(`sendConsumptions: finish process, tgId: ${ctxScene.from.id}.`);
    }
    async lookConsumptionByTrain(ctxScene, totalConsumption) {
        try {
            this.logger.log(`lookConsumptionByTrain: Starting process, tgId: ${ctxScene.from.id}.`);
            this.mainMenu(ctxScene);
            const tgIdString = ctxScene.from.id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            const trainNumber = this.extractTextFromContext(ctxScene);
            this.validateText(trainNumber, shared_1.TrainNumberRegExp, shared_1.TrainNumberMinLeng, shared_1.TrainNumberMaxLeng);
            this.logger.log(`checkTrainNumberByConsumption: Train number in valid, tgId:${ctxScene.from.id}`);
            const train = await this.trainUtil.findTrainByNumber(trainNumber);
            const consumptions = await this.consumptionRepository.findByUserIdAndTrainNumber(train, user);
            this.logger.debug(`lookConsumptionCurrentYear: searched completed, tgId: ${ctxScene.from.id}.`);
            return await this.sendConsumptions(ctxScene, consumptions, totalConsumption);
        }
        catch (error) {
            this.logger.error(`lookConsumptionCurrentYear: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async findRate(ctxScene, ctx) {
        try {
            this.logger.log(`findRate: Starting process, tgId: ${ctxScene.from.id}.`);
            const tgIdString = ctxScene.from.id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            const date = new Date(Date.now() - 1209600000);
            const consumptions = await this.consumptionRepository.findRecentEmptyRate(user, date);
            this.validateConsumptionData(consumptions);
            const group = this.formatConsumptionData(consumptions);
            console.log(group);
            this.logger.debug(`findRate: searched completed, tgId: ${ctxScene.from.id}.`);
            group.push(['Главное меню']);
            await ctxScene.reply(`Выберите данные `, telegraf_1.Markup.keyboard(group).resize());
        }
        catch (error) {
            this.logger.error(`findRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    validateConsumptionData(consumptions) {
        this.logger.log(`validateConsumptionData: Starting process.`);
        if (!consumptions.length) {
            throw new shared_1.TgError('Нет данных');
        }
    }
    formatConsumptionData(consumptions) {
        this.logger.log(`formatConsumptionData: Starting process.`);
        const sortedTrainNumbers = consumptions.map((consumption) => {
            const date = this.formatDateInTimeZone(consumption.createdAt);
            return `Поезд №${consumption.trainNumber}, дата: ${date}, ${consumption.carriage} вагонов.`;
        });
        return this.pairwiseSplit(sortedTrainNumbers);
    }
    async checkRate(ctxScene, ctx) {
        try {
            this.logger.log(`checkRate: Starting process, tgId: ${ctxScene.from.id}.`);
            this.mainMenu(ctxScene);
            const tgIdString = ctxScene.from.id.toString();
            const user = await this.userUtil.getUserById(tgIdString);
            const text = this.extractTextFromContext(ctxScene);
            const validText = this.validateText(text, RateRegExp, RateMinLeng, RateMaxLeng);
            const rateTextData = this.extractRateTextData(validText);
            const rateDate = this.extractRateDate(rateTextData.date);
            const consumption = await this.consumptionRepository.findConsumption(rateTextData.trainNumber, rateDate, user);
            ctx.session.rate.consumptionId = consumption._id;
            await ctxScene.scene.enter('writeRate');
            return;
        }
        catch (error) {
            this.logger.error(`checkRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    extractRateTextData(text) {
        this.logger.log(`extractRateTextData: Starting process.`);
        const match = text.match(RateRegExp);
        const trainNumber = match[1];
        const date = match[2];
        return { trainNumber, date };
    }
    extractRateDate(date) {
        this.logger.log(`extractRateDate: Starting process.`);
        const [day, month, year] = date.split('-');
        const dateInMinsk = moment.tz(`${year}-${month}-${day} 00:00:00`, 'Europe/Minsk');
        const tempDate = dateInMinsk.clone().utc().toDate();
        const start = new Date(tempDate);
        const end = new Date(tempDate.getTime());
        end.setDate(start.getDate() + 1);
        return {
            start,
            end
        };
    }
    async writeRate(ctxScene, ctx) {
        try {
            this.logger.log(`writeRate: Starting process, tgId: ${ctxScene.from.id}.`);
            this.checkParamsInSession(ctx.session.rate.consumptionId);
            await ctxScene.reply('Введите количество топлива:', telegraf_1.Markup.keyboard([['Главное меню']]).resize());
            return;
        }
        catch (error) {
            this.logger.error(`writeRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    async handleWriteRate(ctxScene, ctx) {
        try {
            this.logger.log(`writeRate: Starting process, tgId: ${ctxScene.from.id}.`);
            this.mainMenu(ctxScene);
            this.checkParamsInSession(ctx.session.rate.consumptionId);
            const text = this.extractTextFromContext(ctxScene);
            console.log(text);
            const validateNorm = this.validateText(text, BurntFuelRegExp, BurntFuelMinLeng, BurntFuelMaxLeng);
            const consumptionWithUser = await this.fetchConsumption(ctx.session.rate.consumptionId);
            const tgIdString = ctxScene.from.id.toString();
            this.verifyUserAccess(consumptionWithUser.user, tgIdString);
            const economy = this.calculateEconomy(consumptionWithUser, validateNorm);
            await this.consumptionRepository.updateRate(consumptionWithUser, validateNorm, economy);
            await ctxScene.reply(`Запись создана.\n\nОжидаемый результат: ${economy}`);
            ctx.session.rate.consumptionId = undefined;
            await ctxScene.scene.enter('default');
            return;
        }
        catch (error) {
            this.logger.error(`writeRate: Error in process, tgId:${ctxScene.from.id}, error:${error.message}`);
            return await this.errorHandlerService.handleError(error, ctxScene);
        }
    }
    calculateEconomy(consumption, norm) {
        this.logger.log(`calculateEconomy: Starting process, userId: ${consumption.user._id}.`);
        const fuel = parseInt(consumption.fuel, 10);
        const normNumber = parseInt(norm, 10);
        return fuel - normNumber;
    }
    verifyUserAccess(user, tgId) {
        this.logger.log(`verifyUserAccess: Starting process, userId: ${user._id}, tgId: ${tgId}.`);
        if (user.tgId !== tgId) {
            throw new shared_1.TgError('Ошибка доступа');
        }
    }
    async fetchConsumption(consumptionId) {
        this.logger.log(`fetchConsumption: Starting process, consumptionId: ${consumptionId}.`);
        return typescript_optional_1.Optional.ofNullable(await this.consumptionRepository.retrieveConsumption(consumptionId)).orElseThrow(() => new shared_1.TgError(`Нет данных`));
    }
};
exports.ConsumptionService = ConsumptionService;
exports.ConsumptionService = ConsumptionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [train_repository_1.TrainRepository,
        shared_1.ErrorHandlerService,
        consumption_repository_1.ConsumptionRepository,
        shared_1.TrainUtil,
        shared_1.UserUtil])
], ConsumptionService);
//# sourceMappingURL=consumption.service.js.map