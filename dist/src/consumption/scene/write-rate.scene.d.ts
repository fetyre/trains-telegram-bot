import { Context } from 'nestjs-telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';
export declare class WriteRateScene {
    private readonly consumptionService;
    constructor(consumptionService: ConsumptionService);
    enter(ctxScene: SceneContext, ctx: Context): Promise<void>;
    onText(ctxScene: SceneContext, ctx: Context): Promise<void>;
}
