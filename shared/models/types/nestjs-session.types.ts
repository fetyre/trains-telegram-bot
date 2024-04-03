import { SceneSessionData } from 'telegraf/typings/scenes';

declare module 'nestjs-telegraf' {
	interface Context {
		session: SessionCreateConsumption;
	}
}

interface SessionCreateConsumption extends SceneSessionData {
	trip?: {
		trainNumber?: string;
		carriage?: string;
		fuel?: string;
		
	};
	rate?:{
		consumptionId?: string;
	}
}
