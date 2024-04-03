import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigLoaderService {
	private readonly logger: Logger = new Logger(ConfigLoaderService.name);

	readonly port: number;
	readonly tgKey: string;
	readonly databaseUrl: string;

	constructor(private readonly configService: ConfigService) {
		this.tgKey = this.getStringConfig('tgKey');
		this.port = this.getNumberConfig('port');
		this.databaseUrl = this.getStringConfig('databaseUrl');
	}

	private getNumberConfig(key: string): number {
		this.logger.log(`getNumberConfig: Starting process, key:${key}`);
		return this.configService.get<number>(key);
	}

	private getStringConfig(key: string): string {
		this.logger.log(`getStringConfig: Starting process, key:${key}`);
		return this.configService.get<string>(key);
	}
}
