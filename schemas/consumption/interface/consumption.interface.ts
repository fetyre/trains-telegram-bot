import { Types } from 'mongoose';
import { ICommonSchema } from 'schemas';

export interface IConsumption extends ICommonSchema {
	trainNumber: string;
	descr: string;
	carriage: string;
	fuel: string;
	user: Types.ObjectId;
	train: Types.ObjectId;
	norm: string;
	economy: number;
}
