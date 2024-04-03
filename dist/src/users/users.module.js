"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const users_update_1 = require("./users.update");
const users_service_1 = require("./users.service");
const user_repository_1 = require("./user.repository");
const create_user_scene_1 = require("./scene/create-user.scene");
const shared_1 = require("../../shared");
const schemas_1 = require("../../schemas");
let UsersModule = class UsersModule {
};
exports.UsersModule = UsersModule;
exports.UsersModule = UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [schemas_1.SchemasModule, shared_1.SharedModule],
        providers: [users_service_1.UsersService, create_user_scene_1.RegistrationScene, user_repository_1.UsersRepository, users_update_1.UsersUpdate]
    })
], UsersModule);
//# sourceMappingURL=users.module.js.map