import { ErrorHandlerService, UserUtil } from 'shared';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class StartService {
    private readonly userUtil;
    private readonly errorHandlerService;
    private readonly logger;
    constructor(userUtil: UserUtil, errorHandlerService: ErrorHandlerService);
    start(ctx: SceneContext): Promise<void>;
    private updateUserKeyboard;
    trainAdjustment(ctx: SceneContext): Promise<void>;
    default(ctx: SceneContext): Promise<void>;
    showActionMenu(ctx: SceneContext): Promise<void>;
    showTimeIntervalMenu(ctx: SceneContext): Promise<void>;
}
