import { Ctx, Scene, SceneEnter, On } from 'nestjs-telegraf';
import { UsersService } from '../users.service';
import { Scenes } from 'telegraf';

export interface Context extends Scenes.SceneContext {}

@Scene('registration')
export class RegistrationScene {
	constructor(private readonly usersService: UsersService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: Context): Promise<void> {
		return await this.usersService.checkCreate(ctx);
	}

	@On('text')
	async onText(@Ctx() ctx: Context): Promise<void> {
		return await this.usersService.create(ctx);
	}

	// @SceneLeave()
	// async leave(@Ctx() ctx: Context): Promise<void> {}
}
