import { IConfigLoader } from './interface/config-loader.interface';

export function config(): IConfigLoader {
	return {
		port: parseInt(process.env.PORT, 10),
		tgKey: process.env.TG_KEY,
		databaseUrl: process.env.DATABASE_URL
	};
}
