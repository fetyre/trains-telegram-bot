import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigLoaderService } from '../config/config-loader.serivce';
import { ConfigLoaderModule } from '../config/config-loader.module';
import { UsersModule } from './users/users.module';
import { Context, session } from 'telegraf';
import { TrainModule } from './train/train.module';
import { StartModule } from './start/start.module';
import { ConsumptionModule } from './consumption/consumption.module';

import { MongooseModule } from '@nestjs/mongoose';
import { Redis } from '@telegraf/session/redis';
import { SchemasModule } from '../schemas';
import { SharedModule } from '../shared';

// const session = new LocalSession()

const store = Redis({
	url: 'redis://localhost:6379'
});

@Module({
	imports: [
		ConfigLoaderModule,
		MongooseModule.forRootAsync({
			imports: [ConfigLoaderModule],
			useFactory: async (configLoaderService: ConfigLoaderService) => ({
				uri: configLoaderService.databaseUrl
			}),
			inject: [ConfigLoaderService]
		}),
		SchemasModule,

		TelegrafModule.forRootAsync({
			imports: [ConfigLoaderModule],
			useFactory: async (сonfigLoaderService: ConfigLoaderService) => ({
				token: сonfigLoaderService.tgKey,
				middlewares: [
					session({ defaultSession: () => ({ trip: {}, rate: {} }) })
				],
				elegrafOptions: {
					contextType: (bot, update, telegram) => ({
						...new Context(bot, update, telegram),
						session: {
							trip: {
								trip: {
									trainNumber: '',
									carriage: '',
									fuel: '',
									consumptionId: ''
								}
							},
							rate: {
								rate: {
									consumptionId: ''
								}
							}
						}
					})
				}
			}),
			inject: [ConfigLoaderService]
		}),
		UsersModule,
		TrainModule,
		StartModule,
		SchemasModule,
		SharedModule,
		ConsumptionModule
	],
	controllers: [],
	providers: []
})
export class AppModule {}
