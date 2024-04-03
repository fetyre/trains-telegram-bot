"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClass = void 0;
const common_1 = require("@nestjs/common");
const shared_1 = require("../..");
class BaseClass {
    constructor() {
        this.logger = new common_1.Logger(this.constructor.name);
    }
    mainMenu(ctx) {
        if ('scene' in ctx &&
            'text' in ctx.message &&
            ctx.message.text === 'Главное меню') {
            this.logger.log('Redirecting to main menu');
            throw new shared_1.MainMenu();
        }
        else {
            this.logger.log('Continuing with the current scene');
        }
    }
    extractTextFromContext(ctx) {
        this.logger.log(`extractTrainNumberFromContext: Starting process, tgId:${ctx.from.id}`);
        if (!('text' in ctx.message)) {
            this.logger.debug(`extractTrainNumberFromContext: Text not found, tgId:${ctx.from.id}`);
            throw new shared_1.TgError('Данные обязательны 🙄');
        }
        return ctx.message.text;
    }
    validateText(name, regex, minLeng, maxLeng) {
        this.logger.log(`validateTrainName: Starting process.`);
        name = name.trim();
        if (name.length < minLeng || name.length > maxLeng || !regex?.test(name)) {
            this.logger.debug(`validateTrainName: Starting process, name not valid.`);
            throw new shared_1.ValidationError('Введите корректные данные 🙄');
        }
        return name;
    }
    groupTrainsInPairs(trains) {
        this.logger.log(`groupTrainsInPairs: Starting process.`);
        this.validateTrainsList(trains);
        const sortedTrainNumbers = trains
            .map((train) => train.trainNumber)
            .sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }));
        return this.pairwiseSplit(sortedTrainNumbers);
    }
    pairwiseSplit(sortedTrainNumbers) {
        this.logger.log(`pairwiseSplit: Starting process.`);
        const result = [];
        for (let i = 0; i < sortedTrainNumbers.length; i += 2) {
            result.push([
                sortedTrainNumbers[i],
                sortedTrainNumbers[i + 1] ? sortedTrainNumbers[i + 1] : ''
            ]);
        }
        return result;
    }
    validateTrainsList(trains) {
        this.logger.log(`validateTrainsList: Starting process.`);
        if (trains.length === 0) {
            this.logger.debug(`validateTrainsList: not trains`);
            throw new shared_1.TgError('Нет поездов 🥺');
        }
    }
    checkTrainStatusInactive(train) {
        this.logger.log(`checkTrainStatusInactive: Starting process, trainNumber:${train.trainNumber}`);
        if (train.isActive === false) {
            this.logger.debug(`checkTrainStatusInactive: Train is already inactive, trainNumber:${train.trainNumber}`);
            throw new shared_1.TgError('Поезд уже деактивирован 🥺');
        }
    }
}
exports.BaseClass = BaseClass;
//# sourceMappingURL=base.abstract.js.map