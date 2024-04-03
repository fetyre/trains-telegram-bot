import { SceneContext } from 'telegraf/typings/scenes';
import { TrainRepository } from './train.repository';
import { BaseClass, ErrorHandlerService, TrainUtil, UserUtil } from '../../shared';
export declare class TrainService extends BaseClass {
    private readonly trainRepository;
    private readonly errorHandlerService;
    private readonly trainUtil;
    private readonly userUtil;
    constructor(trainRepository: TrainRepository, errorHandlerService: ErrorHandlerService, trainUtil: TrainUtil, userUtil: UserUtil);
    checkCreate(ctx: SceneContext): Promise<void>;
    private checkUserRole;
    create(ctxScene: SceneContext): Promise<void>;
    private checkTrainExistence;
    displayActiveTrains(ctxScene: SceneContext): Promise<void>;
    deactivateTrain(ctxScene: SceneContext): Promise<void>;
    private checkTrainStatusActive;
    displayInactiveTrains(ctxScene: SceneContext): Promise<void>;
    activateTrain(ctxScene: SceneContext): Promise<void>;
}
