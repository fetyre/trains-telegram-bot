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
var UserUtil_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserUtil = void 0;
const common_1 = require("@nestjs/common");
const users_utils_repository_1 = require("./users-utils.repository");
const typescript_optional_1 = require("typescript-optional");
const shared_1 = require("../..");
let UserUtil = UserUtil_1 = class UserUtil {
    constructor(userRepository) {
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(UserUtil_1.name);
    }
    async getUserById(id) {
        this.logger.log(`getUserById: Starting process, tgId:${id}`);
        return typescript_optional_1.Optional.ofNullable(await this.userRepository.findUserByTgId(id)).orElseThrow(() => new shared_1.TgError(`Выполните регистрацию прежде чем пользоваться сервисом🙃`));
    }
};
exports.UserUtil = UserUtil;
exports.UserUtil = UserUtil = UserUtil_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_utils_repository_1.UsersUtilsRepository])
], UserUtil);
//# sourceMappingURL=users.util.js.map