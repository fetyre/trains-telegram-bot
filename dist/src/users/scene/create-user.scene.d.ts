import { UsersService } from '../users.service';
import { Scenes } from 'telegraf';
export interface Context extends Scenes.SceneContext {
}
export declare class RegistrationScene {
    private readonly usersService;
    constructor(usersService: UsersService);
    enter(ctx: Context): Promise<void>;
    onText(ctx: Context): Promise<void>;
}
