import { Scene, SceneEnter, Ctx } from 'nestjs-telegraf';
import { StartService } from '../start.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene('default')
export class DefaultScene {
	constructor(private readonly startService: StartService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: SceneContext) {
		return await this.startService.default(ctx);
	}
}
