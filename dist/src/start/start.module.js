"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartModule = void 0;
const common_1 = require("@nestjs/common");
const start_service_1 = require("./start.service");
const start_update_1 = require("./start.update");
const users_service_1 = require("../users/users.service");
const user_repository_1 = require("../users/user.repository");
const start_scene_1 = require("./scene/start.scene");
const default_start_scene_1 = require("./scene/default-start.scene");
const shared_1 = require("../../shared");
const schemas_1 = require("../../schemas");
let StartModule = class StartModule {
};
exports.StartModule = StartModule;
exports.StartModule = StartModule = __decorate([
    (0, common_1.Module)({
        imports: [schemas_1.SchemasModule],
        providers: [
            start_service_1.StartService,
            users_service_1.UsersService,
            user_repository_1.UsersRepository,
            start_update_1.StartController,
            start_scene_1.StartScene,
            default_start_scene_1.DefaultScene,
            shared_1.UserUtil,
            shared_1.ErrorHandlerService,
            shared_1.UsersUtilsRepository
        ]
    })
], StartModule);
//# sourceMappingURL=start.module.js.map