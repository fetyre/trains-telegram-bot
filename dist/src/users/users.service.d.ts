import { UsersRepository } from './user.repository';
import { BaseClass, ErrorHandlerService } from 'shared';
import { SceneContext } from 'telegraf/typings/scenes';
export declare class UsersService extends BaseClass {
    private readonly usersRepository;
    private readonly errorHandlerService;
    constructor(usersRepository: UsersRepository, errorHandlerService: ErrorHandlerService);
    checkCreate(ctx: SceneContext): Promise<void>;
    private checkUserExistence;
    create(ctx: SceneContext): Promise<void>;
}
