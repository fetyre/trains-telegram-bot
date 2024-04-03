import { ConsumptionService } from '../consumption.service';
import { Context } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class WriteFuelScene {
    private readonly consumptionService;
    constructor(consumptionService: ConsumptionService);
    enter(ctx: Context, ctxScene: SceneContext): Promise<void>;
    onText(ctx: Context, ctxScene: SceneContext): Promise<void>;
}
