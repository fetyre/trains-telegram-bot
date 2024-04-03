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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainSchema = exports.Train = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const common_schema_1 = require("../common/common.schema");
let Train = class Train extends common_schema_1.CommonSchema {
};
exports.Train = Train;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String, unique: true }),
    __metadata("design:type", String)
], Train.prototype, "trainNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], Train.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: 'Consumption' }] }),
    __metadata("design:type", Array)
], Train.prototype, "consumptions", void 0);
exports.Train = Train = __decorate([
    (0, mongoose_1.Schema)()
], Train);
exports.TrainSchema = mongoose_1.SchemaFactory.createForClass(Train);
//# sourceMappingURL=train.schema.js.map