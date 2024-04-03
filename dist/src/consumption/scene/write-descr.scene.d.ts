import { Context } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';
export declare class WriteDescrScene {
    private readonly consumptionService;
    constructor(consumptionService: ConsumptionService);
    enter(ctx: Context, ctxScene: SceneContext): Promise<void>;
    onText(ctx: Context, ctxScene: SceneContext): Promise<void>;
}
