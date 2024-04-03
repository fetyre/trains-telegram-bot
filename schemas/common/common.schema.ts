import { Prop, Schema } from '@nestjs/mongoose';

import * as uuid from 'uuid';
import { ICommonSchema } from './interface/common.interface';

@Schema({ timestamps: true })
export class CommonSchema implements ICommonSchema {
	@Prop({ default: () => uuid.v4() })
	_id: string;

	@Prop({ type: Date })
	createdAt: Date;

	@Prop({ type: Date })
	updatedAt: Date;
}
