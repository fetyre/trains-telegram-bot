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
var TrainUtil_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainUtil = void 0;
const common_1 = require("@nestjs/common");
const typescript_optional_1 = require("typescript-optional");
const trains_utils_repository_1 = require("./trains-utils.repository");
const shared_1 = require("../..");
let TrainUtil = TrainUtil_1 = class TrainUtil {
    constructor(trainRepository) {
        this.trainRepository = trainRepository;
        this.logger = new common_1.Logger(TrainUtil_1.name);
    }
    async findTrainByNumber(trainNumber) {
        this.logger.log(`getUserById: Starting process, trainNumber:${trainNumber}`);
        return typescript_optional_1.Optional.ofNullable(await this.trainRepository.findTrainByNumber(trainNumber)).orElseThrow(() => new shared_1.TgError(`Нет данных`));
    }
};
exports.TrainUtil = TrainUtil;
exports.TrainUtil = TrainUtil = TrainUtil_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [trains_utils_repository_1.TrainUtilsRepository])
], TrainUtil);
//# sourceMappingURL=trains.utils.js.map