"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainModule = void 0;
const common_1 = require("@nestjs/common");
const train_service_1 = require("./train.service");
const users_service_1 = require("../users/users.service");
const train_repository_1 = require("./train.repository");
const create_train_scene_1 = require("./scene/create-train-scene");
const user_repository_1 = require("../users/user.repository");
const deactivate_train_scene_1 = require("./scene/deactivate-train.scene");
const activate_train_scene_1 = require("./scene/activate-train.scene");
const shared_1 = require("../../shared");
const schemas_1 = require("../../schemas");
let TrainModule = class TrainModule {
};
exports.TrainModule = TrainModule;
exports.TrainModule = TrainModule = __decorate([
    (0, common_1.Module)({
        imports: [schemas_1.SchemasModule, shared_1.SharedModule],
        providers: [
            train_service_1.TrainService,
            users_service_1.UsersService,
            train_repository_1.TrainRepository,
            create_train_scene_1.CreateTrainScene,
            user_repository_1.UsersRepository,
            deactivate_train_scene_1.DeactivateTrainScene,
            activate_train_scene_1.ActivateTrainScene
        ]
    })
], TrainModule);
//# sourceMappingURL=train.module.js.map