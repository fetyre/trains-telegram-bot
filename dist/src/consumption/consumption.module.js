"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsumptionModule = void 0;
const common_1 = require("@nestjs/common");
const consumption_service_1 = require("./consumption.service");
const train_repository_1 = require("../train/train.repository");
const consumption_repository_1 = require("./consumption.repository");
const users_service_1 = require("../users/users.service");
const user_repository_1 = require("../users/user.repository");
const scene_1 = require("./scene");
const schemas_1 = require("../../schemas");
const shared_1 = require("../../shared");
let ConsumptionModule = class ConsumptionModule {
};
exports.ConsumptionModule = ConsumptionModule;
exports.ConsumptionModule = ConsumptionModule = __decorate([
    (0, common_1.Module)({
        imports: [schemas_1.SchemasModule, shared_1.SharedModule],
        providers: [
            consumption_service_1.ConsumptionService,
            train_repository_1.TrainRepository,
            scene_1.CreateConsumptionScene,
            scene_1.WriteCarrigeScene,
            scene_1.WriteFuelScene,
            consumption_repository_1.ConsumptionRepository,
            users_service_1.UsersService,
            user_repository_1.UsersRepository,
            scene_1.CheckDescrWriteScene,
            scene_1.WriteDescrScene,
            scene_1.LookConsumptionWeek,
            scene_1.LookConsumptionСurrentMonth,
            scene_1.LookConsumptionLastMonth,
            scene_1.LookConsumptionLastYear,
            scene_1.LookConsumptionByTrain,
            scene_1.FindRateScene,
            scene_1.WriteRateScene
        ]
    })
], ConsumptionModule);
//# sourceMappingURL=consumption.module.js.map