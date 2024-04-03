import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { BaseClass, ErrorHandlerService, TgError } from '../../shared';
import { SceneContext } from 'telegraf/typings/scenes';
import { Optional } from 'typescript-optional';

const NameRegExp: RegExp =
	/^[а-яА-ЯёЁa-zA-ZуўеёыайцукенгшўзхфівапролджэячсмитьбюУЎЕЁЫАЙЦУКЕНГШЎЗХФІВАПРОЛДЖЭЯЧСМІТЬБЮ\s]+$/;
const NameMinLeng: number = 2;
const NameMaxLeng: number = 50;

@Injectable()
export class UsersService extends BaseClass {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly errorHandlerService: ErrorHandlerService
	) {
		super();
	}

	public async checkCreate(ctx: SceneContext): Promise<void> {
		try {
			this.logger.log(`checkCreate: Starting process, tgId:${ctx.from.id}`);
			const { id } = ctx.from;
			const tgIdString: string = id.toString();
			this.logger.debug(`checkCreate: id made string`);
			await this.checkUserExistence(tgIdString);
			this.logger.debug(`checkCreate: user not found`);
			await ctx.reply('Пожалуйста, введите ваше имя👀');
			return;
		} catch (error) {
			this.logger.error(
				`checkCreate: Error in process, tgId:${ctx.from.id}, error:${error.message}`
			);
			return await this.errorHandlerService.handleError(error, ctx);
		}
	}

	private async checkUserExistence(tgIdString: string): Promise<void> {
		Optional.ofNullable(
			await this.usersRepository.findUserByTgId(tgIdString)
		).ifPresent(() => new TgError(`Вы уже зарегистрированы🙃`));
	}

	public async create(ctx: SceneContext): Promise<void> {
		try {
			this.logger.log(`create: Starting process, tgId:${ctx.from.id}`);
			const name: string = this.extractTextFromContext(ctx);
			const validateName: string = this.validateText(
				name,
				NameRegExp,
				NameMinLeng,
				NameMaxLeng
			);
			this.logger.debug(
				`create: Validated name, tgId:${ctx.from.id}, name:${name}`
			);
			const tgIdString: string = ctx.from.id.toString();
			await this.usersRepository.createUser(name, tgIdString, validateName);
			this.logger.log(
				`create: User created, tgId:${ctx.from.id}, name:${name}`
			);
			await ctx.reply('Регистрация завершена✅');
			await ctx.reply(
				'Спасибо за регистрацию! Пожалуйста, ознакомьтесь с нашими Условиями использования перед началом работы:\n\n' +
					'1. Везде можете использовать Клавиатуру и выбирать нужные данные.\n' +
					'   Где предоставлена клавиатура и вы вводите свои данные, ничего не будет происходить!\n' +
					'2. Где от вас требуется ввод, вводите корректные данные: \n' +
					'   Количество вагонов принимается формат как N так и N+N,\n' +
					'   в спалили/норма требуется жесткий формат N'
			);
			await ctx.scene.enter('default');
			return;
		} catch (error) {
			this.logger.error(
				`create: Error in process, tgId:${ctx.from.id}, error:${error.message}`
			);
			await ctx.reply(`${error.message}`);
			ctx.scene.reset();
		}
	}
}
