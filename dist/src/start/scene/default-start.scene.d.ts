import { StartService } from '../start.service';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class DefaultScene {
    private readonly startService;
    constructor(startService: StartService);
    enter(ctx: SceneContext): Promise<void>;
}
