"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const nestjs_telegraf_1 = require("nestjs-telegraf");
const config_loader_serivce_1 = require("../config/config-loader.serivce");
const config_loader_module_1 = require("../config/config-loader.module");
const users_module_1 = require("./users/users.module");
const telegraf_1 = require("telegraf");
const train_module_1 = require("./train/train.module");
const start_module_1 = require("./start/start.module");
const consumption_module_1 = require("./consumption/consumption.module");
const shared_1 = require("../shared");
const mongoose_1 = require("@nestjs/mongoose");
const schemas_1 = require("../schemas");
const redis_1 = require("@telegraf/session/redis");
const store = (0, redis_1.Redis)({
    url: 'redis://localhost:6379'
});
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_loader_module_1.ConfigLoaderModule,
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_loader_module_1.ConfigLoaderModule],
                useFactory: async (configLoaderService) => ({
                    uri: configLoaderService.databaseUrl
                }),
                inject: [config_loader_serivce_1.ConfigLoaderService]
            }),
            schemas_1.SchemasModule,
            nestjs_telegraf_1.TelegrafModule.forRootAsync({
                imports: [config_loader_module_1.ConfigLoaderModule],
                useFactory: async (сonfigLoaderService) => ({
                    token: сonfigLoaderService.tgKey,
                    middlewares: [
                        (0, telegraf_1.session)({ defaultSession: () => ({ trip: {}, rate: {} }) })
                    ],
                    elegrafOptions: {
                        contextType: (bot, update, telegram) => ({
                            ...new telegraf_1.Context(bot, update, telegram),
                            session: {
                                trip: {
                                    trip: {
                                        trainNumber: '',
                                        carriage: '',
                                        fuel: '',
                                        consumptionId: ''
                                    }
                                },
                                rate: {
                                    rate: {
                                        consumptionId: ''
                                    }
                                }
                            }
                        })
                    }
                }),
                inject: [config_loader_serivce_1.ConfigLoaderService]
            }),
            users_module_1.UsersModule,
            train_module_1.TrainModule,
            start_module_1.StartModule,
            schemas_1.SchemasModule,
            shared_1.SharedModule,
            consumption_module_1.ConsumptionModule
        ],
        controllers: [],
        providers: []
    })
], AppModule);
//# sourceMappingURL=app.module.js.map