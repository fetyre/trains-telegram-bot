import { ConfigService } from '@nestjs/config';
export declare class ConfigLoaderService {
    private readonly configService;
    private readonly logger;
    readonly port: number;
    readonly tgKey: string;
    readonly databaseUrl: string;
    constructor(configService: ConfigService);
    private getNumberConfig;
    private getStringConfig;
}
