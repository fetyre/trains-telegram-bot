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
import { ITrain } from './interface/train.interface';
export type TrainDocument = HydratedDocument<Train>;
export declare class Train extends CommonSchema implements ITrain {
    trainNumber: string;
    isActive: boolean;
    consumptions: Types.ObjectId[];
}
export declare const TrainSchema: import("mongoose").Schema<Train, import("mongoose").Model<Train, any, any, any, import("mongoose").Document<unknown, any, Train> & Train & Required<{
    _id: string;
}>, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Train, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Train>> & import("mongoose").FlatRecord<Train> & Required<{
    _id: string;
}>>;
