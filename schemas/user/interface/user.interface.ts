import { Types } from 'mongoose';
import { ICommonSchema, UserRole } from 'schemas';

export interface IUser extends ICommonSchema {
	name: string;
	tgId: string;
	tgUserName: string;
	role: UserRole;
	consumptions: Types.ObjectId[];
}
