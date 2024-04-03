import { UsersUtilsRepository } from './users-utils.repository';
import { User } from 'schemas';
export declare class UserUtil {
    private userRepository;
    private readonly logger;
    constructor(userRepository: UsersUtilsRepository);
    getUserById(id: string): Promise<User>;
}
