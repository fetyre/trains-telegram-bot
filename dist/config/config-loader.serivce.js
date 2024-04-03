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
var ConfigLoaderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoaderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ConfigLoaderService = ConfigLoaderService_1 = class ConfigLoaderService {
    constructor(configService) {
        this.configService = configService;
        this.logger = new common_1.Logger(ConfigLoaderService_1.name);
        this.tgKey = this.getStringConfig('tgKey');
        this.port = this.getNumberConfig('port');
        this.databaseUrl = this.getStringConfig('databaseUrl');
    }
    getNumberConfig(key) {
        this.logger.log(`getNumberConfig: Starting process, key:${key}`);
        return this.configService.get(key);
    }
    getStringConfig(key) {
        this.logger.log(`getStringConfig: Starting process, key:${key}`);
        return this.configService.get(key);
    }
};
exports.ConfigLoaderService = ConfigLoaderService;
exports.ConfigLoaderService = ConfigLoaderService = ConfigLoaderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ConfigLoaderService);
//# sourceMappingURL=config-loader.serivce.js.map