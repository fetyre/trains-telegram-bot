import { Logger } from '@nestjs/common';
import { Train } from 'schemas';
import { Context } from 'telegraf';
import { SceneContext } from 'telegraf/typings/scenes';
export declare abstract class BaseClass {
    protected readonly logger: Logger;
    constructor();
    protected mainMenu(ctx: SceneContext | Context): void;
    protected extractTextFromContext(ctx: SceneContext): string;
    protected validateText(name: string, regex?: RegExp, minLeng?: number, maxLeng?: number): string;
    protected groupTrainsInPairs(trains: Train[] | []): string[][];
    protected pairwiseSplit(sortedTrainNumbers: string[]): string[][];
    private validateTrainsList;
    protected checkTrainStatusInactive(train: Train): void;
}
