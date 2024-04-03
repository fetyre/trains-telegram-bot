import { Consumption, User } from '../../../schemas';

export type ConsumptionWithUser = Consumption & { user: User };
