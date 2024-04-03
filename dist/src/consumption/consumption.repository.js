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
var ConsumptionRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumptionRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_1 = require("../../schemas");
let ConsumptionRepository = ConsumptionRepository_1 = class ConsumptionRepository {
    constructor(consumptionModel) {
        this.consumptionModel = consumptionModel;
        this.logger = new common_1.Logger(ConsumptionRepository_1.name);
    }
    async createConsumption(data, train, user) {
        return await this.consumptionModel.create({
            ...data,
            user: user._id,
            train: train._id
        });
    }
    async getConsumptionsForTimeRangeByUser(startTime, userId, endTime) {
        this.logger.log(`getConsumptionsForTimeRangeByUser: Starting process.`);
        console.log(startTime);
        return await this.consumptionModel
            .find({
            user: userId,
            createdAt: endTime
                ? { $gte: startTime, $lte: endTime }
                : { $gte: startTime }
        })
            .sort({ createdAt: -1 });
    }
    async findByUserIdAndTrainNumber(train, user) {
        this.logger.log(`findByUserIdAndTrainNumber: Starting process, userId:${user._id}.`);
        return await this.consumptionModel
            .find({
            user: user._id,
            trainNumber: train.trainNumber
        })
            .sort({ createdAt: -1 })
            .limit(5);
    }
    async findRecentEmptyRate(user, date) {
        this.logger.log(`findRecentEmptyRate: Starting process, userId:${user._id}.`);
        return await this.consumptionModel
            .find({
            user: user._id,
            norm: { $in: [null, undefined] },
            createdAt: { $gte: date }
        })
            .sort({ createdAt: -1 });
    }
    async findConsumption(trainNumber, date, user) {
        this.logger.log(`findRecentEmptyRate: Starting process, userId:${user._id}.`);
        return await this.consumptionModel.findOne({
            trainNumber,
            createdAt: { $gte: date.start, $lte: date.end },
            user: user._id,
            norm: { $in: [null, undefined] }
        });
    }
    async retrieveConsumption(consumptionId) {
        this.logger.log(`retrieveConsumption: Starting process, consumptionId:${consumptionId}.`);
        return await this.consumptionModel
            .findOne({
            _id: consumptionId,
            norm: { $in: [null, undefined] }
        })
            .populate('user');
    }
    async updateRate(consumption, norm, economy) {
        this.logger.log(`updateRate: Starting process, consumptionId:${consumption._id}.`);
        return await this.consumptionModel.findOneAndUpdate({
            _id: consumption._id,
            user: consumption.user._id,
            norm: { $in: [null, undefined] }
        }, { $set: { norm, economy } });
    }
    async findLatestConsumptionsByCarriage(user, trainNumber, carriage) {
        this.logger.log(`findLatestConsumptionsByCarriage: Starting process, userId:${user._id}.`);
        return await this.consumptionModel
            .find({
            user: user._id,
            trainNumber,
            carriage: { $regex: carriage },
            norm: { $exists: true, $ne: null }
        })
            .sort({ createdAt: -1 })
            .limit(2);
    }
    async findLatestConsumptionsByExactCarriage(user, trainNumber, carriage) {
        this.logger.log(`findLatestConsumptionsByExactCarriage: Starting process, userId:${user._id}.`);
        return await this.consumptionModel
            .find({
            user: user._id,
            trainNumber,
            carriage,
            norm: { $exists: true, $ne: null }
        })
            .sort({ createdAt: -1 })
            .limit(2);
    }
};
exports.ConsumptionRepository = ConsumptionRepository;
exports.ConsumptionRepository = ConsumptionRepository = ConsumptionRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schemas_1.Consumption.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ConsumptionRepository);
//# sourceMappingURL=consumption.repository.js.map