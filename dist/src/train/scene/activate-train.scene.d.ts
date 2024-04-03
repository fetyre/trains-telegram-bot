import { SceneContext } from 'telegraf/typings/scenes';
import { TrainService } from '../train.service';
export declare class ActivateTrainScene {
    private readonly trainService;
    constructor(trainService: TrainService);
    enter(ctx: SceneContext): Promise<void>;
    onText(ctx: SceneContext): Promise<void>;
}
