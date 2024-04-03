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
import { HydratedDocument, Types } from 'mongoose';
import { CommonSchema } from 'schemas/common/common.schema';
import { IConsumption } from './interface/consumption.interface';
export type ConsumptionDocument = HydratedDocument<Consumption>;
export declare class Consumption extends CommonSchema implements IConsumption {
    trainNumber: string;
    descr: string;
    norm: string;
    economy: number;
    carriage: string;
    fuel: string;
    user: Types.ObjectId;
    train: Types.ObjectId;
}
export declare const ConsumptionSchema: import("mongoose").Schema<Consumption, import("mongoose").Model<Consumption, any, any, any, import("mongoose").Document<unknown, any, Consumption> & Consumption & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Consumption, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Consumption>> & import("mongoose").FlatRecord<Consumption> & Required<{
    _id: string;
}>>;
