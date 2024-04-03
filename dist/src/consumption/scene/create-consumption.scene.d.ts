import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';
import { Context } from 'nestjs-telegraf';
export declare class CreateConsumptionScene {
    private readonly consumptionService;
    constructor(consumptionService: ConsumptionService);
    enter(ctxScene: SceneContext, ctx: Context): Promise<void>;
    onText(ctxScene: SceneContext, ctx: Context): Promise<void>;
}
