import { Test, TestingModule } from '@nestjs/testing';
import { TrainService } from '../train.service';
import {
	UserUtil,
	ErrorHandlerService,
	TrainUtil,
	TgError
} from '../../../shared';
import { SceneContext } from 'telegraf/typings/scenes';
import { TrainRepository } from '../train.repository';
import { Train, User, UserRole } from '../../../schemas';
import { Message } from 'telegraf/typings/core/types/typegram';

describe('TrainService', () => {
	let service: TrainService;
	let mockSceneContext: SceneContext;
	let mockUserUtil: UserUtil;
	let mockTrainRepository: TrainRepository;
	let mockErrorHandlerService: ErrorHandlerService;
	let mockTrainUtil: TrainUtil;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TrainService,
				{ provide: UserUtil, useValue: { getUserById: jest.fn() } },
				{
					provide: TrainRepository,
					useValue: {
						findTrainByNumber: jest.fn(),
						saveTrain: jest.fn(),
						findManyTrains: jest.fn(),
						updateTrainStatus: jest.fn()
					}
				},
				{
					provide: ErrorHandlerService,
					useValue: {
						handleError: jest.fn().mockImplementation(error => {
							throw new Error(error.message ? error.message : '');
						})
					}
				},
				{
					provide: TrainUtil,
					useValue: {
						findTrainByNumber: jest.fn(),
						validateText: jest.fn(),
						extractTextFromContext: jest.fn(),
						groupTrainsInPairs: jest.fn()
					}
				}
			]
		}).compile();

		service = module.get<TrainService>(TrainService);
		mockUserUtil = module.get<UserUtil>(UserUtil);
		mockTrainRepository = module.get<TrainRepository>(TrainRepository);
		mockErrorHandlerService =
			module.get<ErrorHandlerService>(ErrorHandlerService);
		mockTrainUtil = module.get<TrainUtil>(TrainUtil);
		mockSceneContext = {
			from: { id: 123 },
			reply: jest.fn(),
			scene: { enter: jest.fn() },
			message: {
				text: 'Test message',
				chat: { id: 123 }
			} as Message.TextMessage,
			updateType: 'message',
			match: ['Test command', 'Test argument'],
			state: {},
			wizard: { steps: [], cursor: 0, state: {} },
			callbackQuery: { data: 'Test data' },
			inlineQuery: { query: 'Test query' },
			chosenInlineResult: { result_id: 'Test result' },
			shippingQuery: { invoice_payload: 'Test payload' },
			preCheckoutQuery: { invoice_payload: 'Test payload' }
		} as unknown as SceneContext;
	});

	describe('checkCreate', () => {
		it('should check user role and reply', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.Admin } as User);
			await service.checkCreate(mockSceneContext);
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				'Пожалуйста введите номер поезда 🙄'
			);
		});

		it('should throw error if user role is not admin', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.User } as User);
			await expect(service.checkCreate(mockSceneContext)).rejects.toThrow(
				'Ошибка доступа🤨'
			);
		});

		it('should throw error if getUserById fails', async () => {
			jest.spyOn(mockUserUtil, 'getUserById').mockImplementation(() => {
				throw new Error('Ошибка поиска пользователя🤨');
			});
			await expect(service.checkCreate(mockSceneContext)).rejects.toThrow(
				'Ошибка поиска пользователя🤨'
			);
		});

		it('should throw error if ctx.from or ctx.from.id is undefined', async () => {
			mockSceneContext.from.id = null;
			await expect(service.checkCreate(mockSceneContext)).rejects.toThrow();
		});
	});

	describe('create', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(service.create(mockSceneContext)).rejects.toThrow();
		});

		it('should throw an error when the train number is not provided', async () => {
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(service.create(mockSceneContext)).rejects.toThrow();
		});

		it('should throw an error when the train number is not numeric', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'рпполппрпвдавваоололол')
				: mockSceneContext;
			await expect(service.create(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when the train number length is more than 4', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '12345')
				: mockSceneContext;
			await expect(service.create(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when the train number has more than one letter', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '123MM')
				: mockSceneContext;
			await expect(service.create(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when a train with the given number already exists', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest
				.spyOn(mockTrainRepository, 'findTrainByNumber')
				.mockResolvedValueOnce({} as Train);
			await expect(service.create(mockSceneContext)).rejects.toThrow(
				'Поезд с таким именем уже существует 🧐'
			);
		});

		it('should throw an error when findTrainByNumber is called', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest
				.spyOn(mockTrainRepository, 'findTrainByNumber')
				.mockImplementation(() => {
					throw new Error();
				});
			await expect(service.create(mockSceneContext)).rejects.toThrow('');
		});

		it('should throw an error when saveTrain throws an error', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest
				.spyOn(mockTrainRepository, 'findTrainByNumber')
				.mockResolvedValueOnce(null);
			jest.spyOn(mockTrainRepository, 'saveTrain').mockImplementation(() => {
				throw new Error();
			});
			await expect(service.create(mockSceneContext)).rejects.toThrow();
		});

		it('should not throw an error when saveTrain is successful with a numeric train number', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest
				.spyOn(mockTrainRepository, 'findTrainByNumber')
				.mockResolvedValueOnce(null);
			jest
				.spyOn(mockTrainRepository, 'saveTrain')
				.mockResolvedValueOnce({} as Train);
			await expect(service.create(mockSceneContext)).resolves.not.toThrow();
		});

		it('should not throw an error when saveTrain is successful with an alphanumeric train number', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainRepository, 'findTrainByNumber')
				.mockResolvedValueOnce(null);
			jest
				.spyOn(mockTrainRepository, 'saveTrain')
				.mockResolvedValueOnce({} as Train);
			await expect(service.create(mockSceneContext)).resolves.not.toThrow();
		});
	});

	describe('deactivateTrain', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow(
				''
			);
		});

		it('should throw an error when the train number is not provided', async () => {
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow(
				'Данные обязательны 🙄'
			);
		});

		it('should throw an error when the train number is not numeric', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'рпполппрпвдавваоололол')
				: mockSceneContext;
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when the train number length is more than 4', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '12345')
				: mockSceneContext;
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when the train number has more than one letter', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '123MM')
				: mockSceneContext;
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when no train data is found', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest.spyOn(mockTrainUtil, 'findTrainByNumber').mockImplementation(() => {
				throw new TgError('Нет данных');
			});
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow(
				'Нет данных'
			);
		});

		it('should throw an error when trying to deactivate an already deactivated train (alphanumeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow(
				'Поезд уже деактивирован 🥺'
			);
		});

		it('should throw an error when updateTrainStatus throws an error (alphanumeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: true } as Train);
			jest
				.spyOn(mockTrainRepository, 'updateTrainStatus')
				.mockImplementation(() => {
					throw new Error();
				});
			await expect(service.deactivateTrain(mockSceneContext)).rejects.toThrow();
		});

		it('should not throw an error when deactivating an active train (alphanumeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: true } as Train);
			jest
				.spyOn(mockTrainRepository, 'updateTrainStatus')
				.mockResolvedValueOnce({ isActive: false } as Train);
			await expect(
				service.deactivateTrain(mockSceneContext)
			).resolves.not.toThrow();
		});

		it('should not throw an error when deactivating an active train (numeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: true } as Train);
			jest
				.spyOn(mockTrainRepository, 'updateTrainStatus')
				.mockResolvedValueOnce({ isActive: false } as Train);
			await expect(
				service.deactivateTrain(mockSceneContext)
			).resolves.not.toThrow();
		});
	});

	describe('activateTrain', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow('');
		});

		it('should throw an error when the train number is not provided', async () => {
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow(
				'Данные обязательны 🙄'
			);
		});

		it('should throw an error when the train number is not numeric', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'рпполппрпвдавваоололол')
				: mockSceneContext;
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when the train number length is more than 4', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '12345')
				: mockSceneContext;
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when the train number has more than one letter', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '123MM')
				: mockSceneContext;
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow(
				'Введите корректные данные 🙄'
			);
		});

		it('should throw an error when no train data is found', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest.spyOn(mockTrainUtil, 'findTrainByNumber').mockImplementation(() => {
				throw new TgError('Нет данных');
			});
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow(
				'Нет данных'
			);
		});

		it('should throw an error when trying to activate an already active train (alphanumeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: true } as Train);
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow(
				'Поезд уже активирован 🥺'
			);
		});

		it('should throw an error when updateTrainStatus throws an error (alphanumeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest
				.spyOn(mockTrainRepository, 'updateTrainStatus')
				.mockImplementation(() => {
					throw new Error();
				});
			await expect(service.activateTrain(mockSceneContext)).rejects.toThrow();
		});

		it('should not throw an error when activating a deactivated train (alphanumeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest
				.spyOn(mockTrainRepository, 'updateTrainStatus')
				.mockResolvedValueOnce({ isActive: true } as Train);
			await expect(
				service.activateTrain(mockSceneContext)
			).resolves.not.toThrow();
		});

		it('should not throw an error when activating a deactivated train (numeric number)', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest
				.spyOn(mockTrainRepository, 'updateTrainStatus')
				.mockResolvedValueOnce({ isActive: true } as Train);
			await expect(
				service.activateTrain(mockSceneContext)
			).resolves.not.toThrow();
		});
	});

	describe('displayActiveTrains', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.displayActiveTrains(mockSceneContext)
			).rejects.toThrow('');
		});

		it('should throw an access error when the user role is not authorized', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.User } as User);
			await expect(
				service.displayActiveTrains(mockSceneContext)
			).rejects.toThrow('Ошибка доступа🤨');
		});

		it('should throw an error when getUserById throws an error', async () => {
			jest.spyOn(mockUserUtil, 'getUserById').mockImplementation(() => {
				throw new Error();
			});
			await expect(
				service.displayActiveTrains(mockSceneContext)
			).rejects.toThrow();
		});

		it('should throw an error when findManyTrains throws an error', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.Admin } as User);
			jest
				.spyOn(mockTrainRepository, 'findManyTrains')
				.mockImplementation(() => {
					throw new Error();
				});
			await expect(
				service.displayActiveTrains(mockSceneContext)
			).rejects.toThrow();
		});

		it('should throw an error when groupTrainsInPairs throws an error', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.Admin } as User);
			jest
				.spyOn(mockTrainRepository, 'findManyTrains')
				.mockResolvedValueOnce([
					{ trainNumber: '633', isActive: true } as Train,
					{ trainNumber: '635', isActive: true } as Train,
					{ trainNumber: '637M', isActive: true } as Train,
					{ trainNumber: '999M', isActive: true } as Train,
					{ trainNumber: '999', isActive: true } as Train,
					{ trainNumber: '621', isActive: true } as Train,
					{ trainNumber: '477', isActive: true } as Train
				]);
			const createDataErrorMock = jest.fn(() => {
				throw new Error();
			});
			service['groupTrainsInPairs'] = createDataErrorMock;
			await expect(
				service.displayActiveTrains(mockSceneContext)
			).rejects.toThrow();
		});

		it('should include main menu in the group array', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.Admin } as User);
			jest
				.spyOn(mockTrainRepository, 'findManyTrains')
				.mockResolvedValueOnce([
					{ trainNumber: '477', isActive: true } as Train,
					{ trainNumber: '621', isActive: true } as Train,
					{ trainNumber: '633', isActive: true } as Train,
					{ trainNumber: '635', isActive: true } as Train,
					{ trainNumber: '637M', isActive: true } as Train,
					{ trainNumber: '999M', isActive: true } as Train,
					{ trainNumber: '999', isActive: true } as Train
				]);
			await service.displayActiveTrains(mockSceneContext);
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				`Выберите номер поезда из активных ниже 🧜‍♀️`,
				expect.objectContaining({
					reply_markup: expect.objectContaining({
						keyboard: expect.arrayContaining([
							expect.arrayContaining(['477', '621']),
							expect.arrayContaining(['Главное меню'])
						])
					})
				})
			);
		});
	});

	describe('displayInactiveTrains', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.displayInactiveTrains(mockSceneContext)
			).rejects.toThrow('');
		});

		it('should throw an access error when the user role is not authorized', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.User } as User);
			await expect(
				service.displayInactiveTrains(mockSceneContext)
			).rejects.toThrow('Ошибка доступа🤨');
		});

		it('should throw an error when getUserById throws an error', async () => {
			jest.spyOn(mockUserUtil, 'getUserById').mockImplementation(() => {
				throw new Error();
			});
			await expect(
				service.displayInactiveTrains(mockSceneContext)
			).rejects.toThrow();
		});

		it('should throw an error when findManyTrains throws an error', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.Admin } as User);
			jest
				.spyOn(mockTrainRepository, 'findManyTrains')
				.mockImplementation(() => {
					throw new Error();
				});
			await expect(
				service.displayInactiveTrains(mockSceneContext)
			).rejects.toThrow();
		});

		it('should throw an error when groupTrainsInPairs throws an error', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.Admin } as User);
			jest
				.spyOn(mockTrainRepository, 'findManyTrains')
				.mockResolvedValueOnce([
					{ trainNumber: '633', isActive: false } as Train,
					{ trainNumber: '635', isActive: false } as Train,
					{ trainNumber: '637M', isActive: false } as Train,
					{ trainNumber: '999M', isActive: false } as Train,
					{ trainNumber: '999', isActive: false } as Train,
					{ trainNumber: '621', isActive: false } as Train,
					{ trainNumber: '477', isActive: false } as Train
				]);
			const createDataErrorMock = jest.fn(() => {
				throw new Error();
			});
			service['groupTrainsInPairs'] = createDataErrorMock;
			await expect(
				service.displayInactiveTrains(mockSceneContext)
			).rejects.toThrow();
		});

		it('should include main menu in the group array', async () => {
			jest
				.spyOn(mockUserUtil, 'getUserById')
				.mockResolvedValueOnce({ role: UserRole.Admin } as User);
			jest
				.spyOn(mockTrainRepository, 'findManyTrains')
				.mockResolvedValueOnce([
					{ trainNumber: '477', isActive: false } as Train,
					{ trainNumber: '621', isActive: false } as Train,
					{ trainNumber: '633', isActive: false } as Train,
					{ trainNumber: '635', isActive: false } as Train,
					{ trainNumber: '637M', isActive: false } as Train,
					{ trainNumber: '999M', isActive: false } as Train,
					{ trainNumber: '999', isActive: false } as Train
				]);
			await service.displayInactiveTrains(mockSceneContext);
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				`Выберите номер поезда из некативных ниже, который вы хотите активировать 🧜‍♀️`,
				expect.objectContaining({
					reply_markup: expect.objectContaining({
						keyboard: expect.arrayContaining([
							expect.arrayContaining(['477', '621']),
							expect.arrayContaining(['Главное меню'])
						])
					})
				})
			);
		});
	});
});
