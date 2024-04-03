import * as Joi from 'joi';
import { IConfigSchema } from '../interface';

export const validationSchema: Joi.ObjectSchema<IConfigSchema> = Joi.object({
	// NODE_ENV: Joi.string().required(),
	PORT: Joi.number().required(),
	TG_KEY: Joi.string().required(),
	DATABASE_URL: Joi.string().required()
});
