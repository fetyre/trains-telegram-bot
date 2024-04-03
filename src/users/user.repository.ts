import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../../schemas';
import { NullableUser } from '../../shared';



@Injectable()
export class UsersRepository {
	private readonly logger: Logger = new Logger(UsersRepository.name);

	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	public async createUser(
		name: string,
		tgId: string,
		tgUserName: string
	): Promise<User> {
		return await this.userModel.create({ tgId, tgUserName, name });
	}

	public async findUserByTgId(id: string): Promise<NullableUser> {
		this.logger.log(`findUserByTgId: Starting process, tgId:${id}`);
		return await this.userModel.findOne({ tgId: id }).exec();
	}
}
