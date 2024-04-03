import { Test, TestingModule } from '@nestjs/testing';
import { ErrorHandlerService, TgError, UserUtil } from '../../../shared';
import { StartService } from '../start.service';
import { SceneContext } from 'telegraf/typings/scenes';
import { Message } from 'telegraf/typings/core/types/typegram';
import { User, UserRole } from '../../../schemas';
import { Markup } from 'telegraf';

describe('StartService', () => {
	let service: StartService;
	let mockUserUtil: UserUtil;
	let mockErrorHandlerService: ErrorHandlerService;
	let mockSceneContext: SceneContext;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				StartService,
				{ provide: UserUtil, useValue: { getUserById: jest.fn() } },
				{
					provide: ErrorHandlerService,
					useValue: {
						handleError: jest.fn().mockImplementation(error => {
							throw new Error(error.message ? error.message : '');
						})
					}
				}
			]
		}).compile();
		service = module.get<StartService>(StartService);
		mockUserUtil = module.get<UserUtil>(UserUtil);
		mockErrorHandlerService =
			module.get<ErrorHandlerService>(ErrorHandlerService);
		mockSceneContext = {
			from: { id: 123 },
			reply: jest.fn(),
			scene: {
				enter: jest.fn().mockImplementation(scene => {
					return `${scene}`;
				}),
				leave: jest.fn().mockImplementation(() => {
					return 'Leaving scene';
				}),
				reset: jest.fn().mockImplementation(() => {
					return 'Leaving scene';
				})
			},
			message: {
				text: 'Test message',
				chat: { id: 123 }
			} as Message.TextMessage,
			updateType: 'message',
			match: ['Test command', 'Test argument'],
			state: {},
			enter: jest.fn(),
			leave: jest.fn(),
			wizard: { steps: [], cursor: 0, state: {} },
			callbackQuery: { data: 'Test data' },
			inlineQuery: { query: 'Test query' },
			chosenInlineResult: { result_id: 'Test result' },
			shippingQuery: { invoice_payload: 'Test payload' },
			preCheckoutQuery: { invoice_payload: 'Test payload' }
		} as unknown as SceneContext;
	});

	describe('start', () => {
		it('should throw an error, leave the current scene and enter the registration scene', async () => {
			jest.spyOn(mockUserUtil, 'getUserById').mockImplementation(() => {
				throw new TgError(
					'Выполните регистрацию прежде чем пользоваться сервисом🙃'
				);
			});
			const leaveSpy = jest.spyOn(mockSceneContext.scene, 'leave');
			await expect(service.start(mockSceneContext)).resolves.toBeUndefined();
			expect(leaveSpy).toHaveBeenCalled();
			expect(mockSceneContext.scene.enter).toHaveBeenCalledWith('registration');
		});

		it('should not change the keyboard for a regular user', async () => {
			const user: User = { role: UserRole.User } as User;
			(mockUserUtil.getUserById as jest.Mock).mockResolvedValue(user);
			const arrayKeyboard: string[][] = [
				['Добавить расход'],
				['Корректировать рассход'],
				['Посмотреть экономию']
			];
			await service.start(mockSceneContext);
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				`Добро пожаловать ${user.name}`,
				Markup.keyboard(arrayKeyboard).resize()
			);
		});

		it('should add an admin button for an admin user', async () => {
			const user: User = { role: UserRole.Admin } as User;
			(mockUserUtil.getUserById as jest.Mock).mockResolvedValue(user);
			const arrayKeyboard: string[][] = [
				['Добавить расход'],
				['Корректировать рассход'],
				['Посмотреть экономию'],
				['Корректировка поездов.']
			];
			await service.start(mockSceneContext);
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				`Добро пожаловать ${user.name}`,
				Markup.keyboard(arrayKeyboard).resize()
			);
		});
	});

	describe('default', () => {
		it('should throw an error and redirect to registration when user is not registered', async () => {
			jest.spyOn(mockUserUtil, 'getUserById').mockImplementation(() => {
				throw new TgError(
					'Выполните регистрацию прежде чем пользоваться сервисом🙃'
				);
			});
			await expect(service.default(mockSceneContext)).rejects.toThrow();
		});

		it('should display the regular keyboard options for a regular user', async () => {
			const user: User = { role: UserRole.User } as User;
			(mockUserUtil.getUserById as jest.Mock).mockResolvedValue(user);
			const arrayKeyboard: string[][] = [
				['Добавить расход'],
				['Корректировать рассход'],
				['Посмотреть экономию']
			];
			await expect(service.default(mockSceneContext)).resolves.not.toThrow();
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				`Выберете действие:`,
				Markup.keyboard(arrayKeyboard).resize()
			);
		});

		it('should display the admin keyboard options for an admin user', async () => {
			const user: User = { role: UserRole.Admin } as User;
			(mockUserUtil.getUserById as jest.Mock).mockResolvedValue(user);
			const arrayKeyboard: string[][] = [
				['Добавить расход'],
				['Корректировать рассход'],
				['Посмотреть экономию'],
				['Корректировка поездов.']
			];
			await expect(service.default(mockSceneContext)).resolves.not.toThrow();
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				`Выберете действие:`,
				Markup.keyboard(arrayKeyboard).resize()
			);
		});
	});
});
