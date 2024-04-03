import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigLoaderService } from '../config/config-loader.serivce';

async function bootstrap() {
	const app = await NestFactory.create(
		AppModule,
		// new FastifyAdapter()
	);
	const configLoaderService: ConfigLoaderService = app.get(ConfigLoaderService);
	await app.listen(configLoaderService.port);
}
bootstrap();
