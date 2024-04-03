import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionService } from '../consumption.service';
export declare class LookConsumptionLastMonth {
    private readonly consumptionService;
    constructor(consumptionService: ConsumptionService);
    enter(ctxScene: SceneContext): Promise<void>;
}
