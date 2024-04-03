import { Ctx, Scene, SceneEnter } from 'nestjs-telegraf';
import { StartService } from '../start.service';
import { SceneContext } from 'telegraf/typings/scenes';

@Scene('start')
export class StartScene {
	constructor(private readonly startService: StartService) {}

	@SceneEnter()
	async enter(@Ctx() ctx: SceneContext) {
		return await this.startService.start(ctx);
	}
}
