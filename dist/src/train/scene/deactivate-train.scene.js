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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeactivateTrainScene = void 0;
const nestjs_telegraf_1 = require("nestjs-telegraf");
const train_service_1 = require("../train.service");
let DeactivateTrainScene = class DeactivateTrainScene {
    constructor(trainService) {
        this.trainService = trainService;
    }
    async enter(ctx) {
        return await this.trainService.displayActiveTrains(ctx);
    }
    async onText(ctx) {
        return await this.trainService.deactivateTrain(ctx);
    }
};
exports.DeactivateTrainScene = DeactivateTrainScene;
__decorate([
    (0, nestjs_telegraf_1.SceneEnter)(),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeactivateTrainScene.prototype, "enter", null);
__decorate([
    (0, nestjs_telegraf_1.On)('text'),
    __param(0, (0, nestjs_telegraf_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DeactivateTrainScene.prototype, "onText", null);
exports.DeactivateTrainScene = DeactivateTrainScene = __decorate([
    (0, nestjs_telegraf_1.Scene)('deactivateTrain'),
    __metadata("design:paramtypes", [train_service_1.TrainService])
], DeactivateTrainScene);
//# sourceMappingURL=deactivate-train.scene.js.map