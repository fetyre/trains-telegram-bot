import { Command, Ctx, Update } from 'nestjs-telegraf';
import { UsersService } from './users.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Update()
export class UsersUpdate {
	constructor(private readonly usersService: UsersService) {}

	@Command('newuser')
	async onStart(@Ctx() ctx: SceneContext): Promise<void> {
		await ctx.scene.enter('registration');
	}
}
