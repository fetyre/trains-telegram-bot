import { UsersService } from './users.service';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class UsersUpdate {
    private readonly usersService;
    constructor(usersService: UsersService);
    onStart(ctx: SceneContext): Promise<void>;
}
