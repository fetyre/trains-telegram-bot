import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { IUser } from './interface/user.interface';
import { UserRole } from './enums/user-role.enum';
import { CommonSchema } from '../common/common.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends CommonSchema implements IUser {
	@Prop({ required: true, type: String })
	name: string;

	@Prop({ required: true, type: String, unique: true })
	tgId: string;

	@Prop({ required: true, type: String })
	tgUserName: string;

	@Prop({ type: String, enum: Object.values(UserRole), default: UserRole.User })
	role: UserRole;

	@Prop({ type: [{ type: Types.ObjectId, ref: 'Consumption' }] })
	consumptions: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
