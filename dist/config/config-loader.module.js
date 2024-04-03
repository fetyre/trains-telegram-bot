"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoaderModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const config_loader_serivce_1 = require("./config-loader.serivce");
const config_2 = require("./");
const config_loader_schema_1 = require("./schema/config-loader.schema");
let ConfigLoaderModule = class ConfigLoaderModule {
};
exports.ConfigLoaderModule = ConfigLoaderModule;
exports.ConfigLoaderModule = ConfigLoaderModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                validationSchema: config_loader_schema_1.validationSchema,
                load: [config_2.config]
            })
        ],
        providers: [config_loader_serivce_1.ConfigLoaderService],
        exports: [config_loader_serivce_1.ConfigLoaderService]
    })
], ConfigLoaderModule);
//# sourceMappingURL=config-loader.module.js.map