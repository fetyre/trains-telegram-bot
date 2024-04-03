"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = require("joi");
exports.validationSchema = Joi.object({
    PORT: Joi.number().required(),
    TG_KEY: Joi.string().required(),
    DATABASE_URL: Joi.string().required()
});
//# sourceMappingURL=config-loader.schema.js.map