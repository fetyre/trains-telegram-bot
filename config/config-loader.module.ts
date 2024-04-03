import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigLoaderService } from './config-loader.serivce';
import { config } from 'config';
import { validationSchema } from './schema/config-loader.schema';

@Global()
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			validationSchema,
			load: [config]
		})
	],
	providers: [ConfigLoaderService],
	exports: [ConfigLoaderService]
})
export class ConfigLoaderModule {}
