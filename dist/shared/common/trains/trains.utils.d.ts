import { TrainUtilsRepository } from './trains-utils.repository';
import { Train } from 'schemas';
export declare class TrainUtil {
    private trainRepository;
    private readonly logger;
    constructor(trainRepository: TrainUtilsRepository);
    findTrainByNumber(trainNumber: string): Promise<Train>;
}
