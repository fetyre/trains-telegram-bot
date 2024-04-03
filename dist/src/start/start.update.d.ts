import { StartService } from './start.service';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class StartController {
    private readonly startService;
    constructor(startService: StartService);
    start(ctx: SceneContext): Promise<void>;
    default(ctx: SceneContext): Promise<void>;
    create(ctx: SceneContext): Promise<void>;
    lookConsumptionByTrain(ctx: SceneContext): Promise<void>;
    updateRate(ctx: SceneContext): Promise<void>;
    trainAdjustment(ctx: SceneContext): Promise<void>;
    showActionMenu(ctx: SceneContext): Promise<void>;
    vfdvdfva(ctx: SceneContext): Promise<void>;
    lookConsumptionWeek(ctx: SceneContext): Promise<void>;
    lookConsumptionСurrentMonth(ctx: SceneContext): Promise<void>;
    lookConsumptionLastMonth(ctx: SceneContext): Promise<void>;
    lookConsumptionCurrentYear(ctx: SceneContext): Promise<void>;
    createTrain(ctx: SceneContext): Promise<void>;
    deactivateTrain(ctx: SceneContext): Promise<void>;
    activateTrain(ctx: SceneContext): Promise<void>;
}
