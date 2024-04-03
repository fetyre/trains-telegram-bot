import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from '../../../schemas';
import { NullableUser } from '../../models/types/common.types';


@Injectable()
export class UsersUtilsRepository {
	private readonly logger: Logger = new Logger(UsersUtilsRepository.name);
	constructor(@InjectModel('User') private userModel: Model<UserDocument>) {}

	public async findUserByTgId(id: string): Promise<NullableUser> {
		this.logger.log(`findUserByTgId: Starting process, tgId:${id}`);
		return await this.userModel.findOne({ tgId: id }).exec();
	}
}
