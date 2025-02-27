import { Context } from 'nestjs-telegraf';
import { TrainRepository } from 'src/train/train.repository';
import { SceneContext } from 'telegraf/typings/scenes';
import { ConsumptionRepository } from './consumption.repository';
import { BaseClass, ErrorHandlerService, TrainUtil, UserUtil } from 'shared';
import { Train, Consumption, User } from 'schemas';
export declare class ConsumptionService extends BaseClass {
    private readonly trainRepository;
    private readonly errorHandlerService;
    private readonly consumptionRepository;
    private readonly trainUtil;
    private readonly userUtil;
    constructor(trainRepository: TrainRepository, errorHandlerService: ErrorHandlerService, consumptionRepository: ConsumptionRepository, trainUtil: TrainUtil, userUtil: UserUtil);
    createConsumption(ctxScene: SceneContext, ctx: Context): Promise<void>;
    checkTrainNumberByConsumption(ctxScene: SceneContext, ctx: Context): Promise<void>;
    writeCarrige(ctx: Context, ctxScene: SceneContext): Promise<void>;
    private checkParamsInSession;
    checkCarrige(ctx: Context, ctxScene: SceneContext): Promise<void>;
    private tgtg;
    writeFuel(ctx: Context, ctxScene: SceneContext): Promise<void>;
    checkFuel(ctx: Context, ctxScene: SceneContext): Promise<void>;
    enterCheckDescription(ctx: Context, ctxScene: SceneContext): Promise<void>;
    handleCheckDescriptionInput(ctx: Context, ctxScene: SceneContext): Promise<void>;
    private handleYesChoice;
    private handleNoChoice;
    private displayExpectedResult;
    calculateFuelDifference(train: Train, user: User, carriage: string, fuel: string): Promise<string | null>;
    calculateAverageNorm(consumptions: Consumption[]): Promise<string | null>;
    private calculateFuelDifferenceWithPlus;
    private calculateFuelDifferenceGeneral;
    enterWriteDescription(ctx: Context, ctxScene: SceneContext): Promise<void>;
    handleWriteDescriptionInput(ctx: Context, ctxScene: SceneContext): Promise<void>;
    getConsumption(ctxScene: SceneContext, dateRange: () => [Date, Date?], totalConsumption?: (consumptions: Consumption[]) => number): Promise<void>;
    private formattedConsumptions;
    private formatDateInTimeZone;
    datesLastMonth(): [Date, Date?];
    dateFirtDayInCurrentMonth(): [Date, Date?];
    dateCurrentWeek(): [Date, Date?];
    dateCurrentYear(): [Date, Date?];
    sumTotalConsumption(consumptions: Consumption[]): number;
    private sendConsumptions;
    lookConsumptionByTrain(ctxScene: SceneContext, totalConsumption?: (consumptions: Consumption[]) => number): Promise<void>;
    findRate(ctxScene: SceneContext, ctx: Context): Promise<void>;
    private validateConsumptionData;
    private formatConsumptionData;
    checkRate(ctxScene: SceneContext, ctx: Context): Promise<void>;
    private extractRateTextData;
    private extractRateDate;
    writeRate(ctxScene: SceneContext, ctx: Context): Promise<void>;
    handleWriteRate(ctxScene: SceneContext, ctx: Context): Promise<void>;
    private calculateEconomy;
    private verifyUserAccess;
    private fetchConsumption;
}
