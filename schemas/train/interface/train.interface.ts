import { Types } from 'mongoose';
import { ICommonSchema } from 'schemas';

export interface ITrain extends ICommonSchema {
	trainNumber: string;
	isActive: boolean;
	consumptions: Types.ObjectId[];
}
