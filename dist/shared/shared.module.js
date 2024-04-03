"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedModule = void 0;
const users_1 = require("./common/users");
const trains_1 = require("./common/trains");
const errro_catch_1 = require("./common/errro-catch");
const common_1 = require("@nestjs/common");
const schemas_1 = require("../schemas");
let SharedModule = class SharedModule {
};
exports.SharedModule = SharedModule;
exports.SharedModule = SharedModule = __decorate([
    (0, common_1.Module)({
        imports: [schemas_1.SchemasModule],
        providers: [
            trains_1.TrainUtil,
            trains_1.TrainUtilsRepository,
            users_1.UserUtil,
            users_1.UsersUtilsRepository,
            errro_catch_1.ErrorHandlerService
        ],
        exports: [
            trains_1.TrainUtil,
            trains_1.TrainUtilsRepository,
            users_1.UserUtil,
            users_1.UsersUtilsRepository,
            errro_catch_1.ErrorHandlerService
        ]
    })
], SharedModule);
//# sourceMappingURL=shared.module.js.map