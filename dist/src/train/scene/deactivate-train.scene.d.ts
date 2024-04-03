import { TrainService } from '../train.service';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class DeactivateTrainScene {
    private readonly trainService;
    constructor(trainService: TrainService);
    enter(ctx: SceneContext): Promise<void>;
    onText(ctx: SceneContext): Promise<void>;
}
