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
var TrainRepository_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const schemas_1 = require("../../schemas");
let TrainRepository = TrainRepository_1 = class TrainRepository {
    constructor(trainModel) {
        this.trainModel = trainModel;
        this.logger = new common_1.Logger(TrainRepository_1.name);
    }
    async findTrainByNumber(trainNumber) {
        this.logger.log(`findTrainByNumber: Starting process, trainNumber:${trainNumber}`);
        return await this.trainModel.findOne({ trainNumber }).exec();
    }
    async saveTrain(trainNumber) {
        this.logger.log(`saveTrain: Starting process, trainNumber:${trainNumber}`);
        return await this.trainModel.create({ trainNumber });
    }
    async findManyTrains(isActive) {
        this.logger.log(`findManyTrains: Starting process.`);
        return await this.trainModel.find({ isActive });
    }
    async updateTrainStatus(train, isActive) {
        this.logger.log(`updateTrainStatus: Starting process.`);
        return await this.trainModel.findByIdAndUpdate(train._id, { isActive }, { new: true });
    }
};
exports.TrainRepository = TrainRepository;
exports.TrainRepository = TrainRepository = TrainRepository_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(schemas_1.Train.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TrainRepository);
//# sourceMappingURL=train.repository.js.map