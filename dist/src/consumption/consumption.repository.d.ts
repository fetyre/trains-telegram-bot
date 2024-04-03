/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { ICreateConsumption, IRateDate } from './interface';
import { Consumption, ConsumptionDocument, Train, User } from 'schemas';
import { ConsumptionWithUser } from './types';
export declare class ConsumptionRepository {
    private consumptionModel;
    private readonly logger;
    constructor(consumptionModel: Model<ConsumptionDocument>);
    createConsumption(data: ICreateConsumption, train: Train, user: User): Promise<Consumption>;
    getConsumptionsForTimeRangeByUser(startTime: Date, userId: string, endTime?: Date): Promise<Consumption[]>;
    findByUserIdAndTrainNumber(train: Train, user: User): Promise<Consumption[]>;
    findRecentEmptyRate(user: User, date: Date): Promise<Consumption[]>;
    findConsumption(trainNumber: string, date: IRateDate, user: User): Promise<Consumption>;
    retrieveConsumption(consumptionId: string): Promise<ConsumptionWithUser>;
    updateRate(consumption: Consumption, norm: string, economy: number): Promise<Consumption>;
    findLatestConsumptionsByCarriage(user: User, trainNumber: string, carriage: string): Promise<Consumption[]>;
    findLatestConsumptionsByExactCarriage(user: User, trainNumber: string, carriage: string): Promise<Consumption[]>;
}
