import { Context } from 'nestjs-telegraf';
import { ConsumptionService } from '../consumption.service';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class CheckDescrWriteScene {
    private readonly consumptionService;
    constructor(consumptionService: ConsumptionService);
    enter(ctx: Context, ctxScene: SceneContext): Promise<void>;
    onText(ctx: Context, ctxScene: SceneContext): Promise<void>;
}
