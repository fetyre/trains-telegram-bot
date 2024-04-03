import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class ErrorHandlerService {
    private readonly logger;
    handleError(error: any, ctx: SceneContext | Context): Promise<void>;
}
