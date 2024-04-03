import { Test, TestingModule } from '@nestjs/testing';
import { ConsumptionService } from '../consumption.service';
import { SceneContext } from 'telegraf/typings/scenes';
import {
	UserUtil,
	ErrorHandlerService,
	TrainUtil,
	TgError
} from '../../../shared';
import { TrainRepository } from '../../train/train.repository';
import { Message } from 'telegraf/typings/core/types/typegram';
import { Context } from 'nestjs-telegraf';
import { ConsumptionRepository } from '../consumption.repository';
import { Consumption, Train, User } from '../../../schemas';
import { Markup } from 'telegraf';
import { error } from 'console';

describe('ConsumptionService', () => {
	let service: ConsumptionService;
	let mockSceneContext: SceneContext;
	let mockUserUtil: UserUtil;
	let mockTrainRepository: TrainRepository;
	let mockErrorHandlerService: ErrorHandlerService;
	let mockTrainUtil: TrainUtil;
	let mockContext: Context;
	let mockConsumptionRepository: ConsumptionRepository;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ConsumptionService,
				{ provide: UserUtil, useValue: { getUserById: jest.fn() } },
				{
					provide: ConsumptionRepository,
					useValue: {
						getUserById: jest.fn(),
						createConsumption: jest.fn(),
						findLatestConsumptionsByCarriage: jest.fn(),
						findLatestConsumptionsByExactCarriage: jest.fn()
					}
				},
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

		service = module.get<ConsumptionService>(ConsumptionService);
		mockUserUtil = module.get<UserUtil>(UserUtil);
		mockTrainRepository = module.get<TrainRepository>(TrainRepository);
		mockErrorHandlerService =
			module.get<ErrorHandlerService>(ErrorHandlerService);
		mockTrainUtil = module.get<TrainUtil>(TrainUtil);
		mockConsumptionRepository = module.get<ConsumptionRepository>(
			ConsumptionRepository
		);
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
		mockContext = {
			session: {
				trip: {
					trainNumber: '',
					carrige: '',
					fuel: ''
				},
				rate: {
					consumptionId: ''
				}
			}
		} as unknown as Context;
	});

	describe('createConsumption', () => {
		it('should not call groupTrainsInPairs when findManyTrains throws an error', async () => {
			jest
				.spyOn(mockTrainRepository, 'findManyTrains')
				.mockImplementation(() => {
					throw new Error();
				});

			const groupTrainsInPairsSpy = jest.spyOn(
				service as any,
				'groupTrainsInPairs'
			);

			await expect(
				service.createConsumption(mockSceneContext, mockContext)
			).rejects.toThrow();

			expect(groupTrainsInPairsSpy).not.toHaveBeenCalled();
		});

		it('should not call groupTrainsInPairs when findManyTrains throws an error', async () => {
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
				throw new Error('ошибка');
			});
			service['groupTrainsInPairs'] = createDataErrorMock;
			await expect(
				service.createConsumption(mockSceneContext, mockContext)
			).rejects.toThrow();
		});

		it('checking the correctness of the response returned', async () => {
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
			await expect(
				service.createConsumption(mockSceneContext, mockContext)
			).resolves.not.toThrow();
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				`Выберите номер поезда из активных ниже `,
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

	describe('checkTrainNumberByConsumption', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).rejects.toThrow('');
		});

		it('should throw an error when the train number is not provided', async () => {
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).rejects.toThrow('Данные обязательны 🙄');
		});

		it('should throw an error when the train number is not numeric', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'рпполппрпвдавваоололол')
				: mockSceneContext;
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('should throw an error when the train number length is more than 4', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '12345')
				: mockSceneContext;
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('should throw an error when the train number has more than one letter', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '123MM')
				: mockSceneContext;
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('should throw an error when no train data is found', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest.spyOn(mockTrainUtil, 'findTrainByNumber').mockImplementation(() => {
				throw new TgError('Нет данных');
			});
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).rejects.toThrow('Нет данных');
		});

		it('error accessing the train when it is deactivated', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).rejects.toThrow('Поезд уже деактивирован 🥺');
		});

		it('check for correct execution when the train number consists only of numbers', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633М')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: true } as Train);
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).resolves.not.toThrow();
		});

		it('check for correct execution when the train number contains a letter', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '633')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: true } as Train);
			await expect(
				service.checkTrainNumberByConsumption(mockSceneContext, mockContext)
			).resolves.not.toThrow();
		});
	});

	describe('writeCarrige', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.writeCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
		});

		it('checking the case when the train number is missing in the session and throwing an error', async () => {
			delete mockContext.session.trip.trainNumber;
			await expect(
				service.writeCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('check when the parameters in the session are filled and complete without errors', async () => {
			mockContext.session.trip.trainNumber = '675';
			await expect(
				service.writeCarrige(mockContext, mockSceneContext)
			).resolves.not.toThrow('');
		});

		it('check when the parameters in the session are filled and complete without errors, check what is sent to the user', async () => {
			mockContext.session.trip.trainNumber = '675';
			await expect(
				service.writeCarrige(mockContext, mockSceneContext)
			).resolves.not.toThrow('');
			expect(mockSceneContext.reply).toHaveBeenCalledWith(
				'Введите количество вагонов',
				Markup.keyboard(['Главное меню']).oneTime().resize()
			);
		});
	});

	describe('checkCarrige', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('');
		});

		it('should throw an error when the carrige is not provided', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Данные обязательны 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '8 +  1')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '9999')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '999')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'asdasd')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '67nvbn')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'bngbjf897987')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '99 +  154')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '99 +  154')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('should throw an error and log it when removeWhitespace fails', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '8')
				: mockSceneContext;
			const createDataErrorMock = jest.fn(() => {
				throw new Error('ошибка');
			});
			service['removeWhitespace'] = createDataErrorMock;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('should not throw an error and enter a scene when removeWhitespace succeeds', async () => {
			mockContext.session.trip.trainNumber = '675';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '8')
				: mockSceneContext;

			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).resolves.not.toThrow();
			expect(mockSceneContext.scene.enter).toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled();
		});
	});

	describe('writeFuel', () => {
		it('checking the case when the train number is missing in the session and throwing an error', async () => {
			delete mockContext.session.trip.trainNumber;
			await expect(
				service.writeFuel(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the carrige is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			delete mockContext.session.trip.carriage;
			await expect(
				service.writeFuel(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('check when all session parameters are present, waiting no errors', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			await expect(
				service.writeFuel(mockContext, mockSceneContext)
			).resolves.not.toThrow('');
			expect(mockSceneContext.reply).toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled();
		});
	});

	describe('checkFuel', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.checkCarrige(mockContext, mockSceneContext)
			).rejects.toThrow('');
		});

		it('checking the case when the train number is missing in the session and throwing an error', async () => {
			delete mockContext.session.trip.trainNumber;
			await expect(
				service.checkFuel(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.scene.enter).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the carrige is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			delete mockContext.session.trip.carriage;
			await expect(
				service.checkFuel(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.scene.enter).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('check for error throw if there is no text data', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(
				service.checkFuel(mockContext, mockSceneContext)
			).rejects.toThrow('Данные обязательны 🙄');
			expect(mockSceneContext.scene.enter).not.toHaveBeenCalled();
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'asdasdasd')
				: mockSceneContext;
			await expect(
				service.checkFuel(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});

		it('check validate ', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '453463463466')
				: mockSceneContext;
			await expect(
				service.checkFuel(mockContext, mockSceneContext)
			).rejects.toThrow('Введите корректные данные 🙄');
		});
	});

	describe('enterCheckDescription', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
		});

		it('checking the case when the train number is missing in the session and throwing an error', async () => {
			delete mockContext.session.trip.trainNumber;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the carrige is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			delete mockContext.session.trip.carriage;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the fuel is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			delete mockContext.session.trip.fuel;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking that everything is fine', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).resolves.not.toThrow();
			expect(mockSceneContext.reply).toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled();
		});
	});

	describe('handleCheckDescriptionInput', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
		});

		it('checking the case when the train number is missing in the session and throwing an error', async () => {
			delete mockContext.session.trip.trainNumber;
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the carrige is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			delete mockContext.session.trip.carriage;
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the fuel is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			delete mockContext.session.trip.fuel;
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('when there is no text', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('Данные обязательны 🙄');
		});

		it('unknown answer option', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = '453463463466')
				: mockSceneContext;
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow();
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('when selected no, and no train but number', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'нет')
				: mockSceneContext;
			jest.spyOn(mockTrainUtil, 'findTrainByNumber').mockImplementation(() => {
				throw new TgError('Нет данных');
			});
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow();
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('when selected no, and no user but tgId', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'нет')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockImplementation(() => {
				throw new TgError('Нет данных');
			});
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow();
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('when no is selected, and when creating in the database', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'нет')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockResolvedValueOnce({} as User);
			jest
				.spyOn(mockConsumptionRepository, 'createConsumption')
				.mockImplementation(() => {
					throw new TgError('Нет данных');
				});
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow();
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('when no is selected, and and when absent + error when loading from the database', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'нет')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockResolvedValueOnce({} as User);
			jest
				.spyOn(mockConsumptionRepository, 'createConsumption')
				.mockResolvedValueOnce(null);
			jest
				.spyOn(mockConsumptionRepository, 'findLatestConsumptionsByCarriage')
				.mockImplementation(() => {
					throw new TgError('Нет данных');
				});
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow();
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('when no is selected, and and when absent + and everything is fine', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'нет')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockResolvedValueOnce({} as User);
			jest
				.spyOn(mockConsumptionRepository, 'createConsumption')
				.mockResolvedValueOnce(null);
			jest
				.spyOn(mockConsumptionRepository, 'findLatestConsumptionsByCarriage')
				.mockResolvedValueOnce([
					{ norm: '897' },
					{ norm: '965' }
				] as Consumption[]);
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).resolves.not.toThrow();
			expect(mockSceneContext.reply).toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled();
		});

		it('when no is selected, and there is - or + in the cars, an error is thrown when loading from the database', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8-1';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'нет')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockResolvedValueOnce({} as User);
			jest
				.spyOn(mockConsumptionRepository, 'createConsumption')
				.mockResolvedValueOnce(null);
			jest
				.spyOn(
					mockConsumptionRepository,
					'findLatestConsumptionsByExactCarriage'
				)
				.mockImplementation(() => {
					throw new TgError('Нет данных');
				});
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow();
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('when no is selected, and there is - or + in the cars, and everything is fine', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8-1';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'нет')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({ isActive: false } as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockResolvedValueOnce({} as User);
			jest
				.spyOn(mockConsumptionRepository, 'createConsumption')
				.mockResolvedValueOnce(null);
			jest
				.spyOn(
					mockConsumptionRepository,
					'findLatestConsumptionsByExactCarriage'
				)
				.mockResolvedValueOnce([
					{ norm: '897' },
					{ norm: '965' }
				] as Consumption[]);
			jest
				.spyOn(
					mockConsumptionRepository,
					'findLatestConsumptionsByExactCarriage'
				)
				.mockResolvedValueOnce([
					{ norm: '898' },
					{ norm: '961' }
				] as Consumption[]);
			await expect(
				service.handleCheckDescriptionInput(mockContext, mockSceneContext)
			).resolves.not.toThrow();
			expect(mockSceneContext.reply).toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled();
		});
	});

	describe('handleWriteDescriptionInput', () => {
		it('should throw an error when the user requests the main menu', async () => {
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'Главное меню')
				: mockSceneContext;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
		});

		it('checking the case when the train number is missing in the session and throwing an error', async () => {
			delete mockContext.session.trip.trainNumber;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the carrige is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			delete mockContext.session.trip.carriage;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('checking the case when the fuel is missing in the session and throwing an error', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			delete mockContext.session.trip.fuel;
			await expect(
				service.enterCheckDescription(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('error found train', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'sdaadasd')
				: mockSceneContext;
			jest.spyOn(mockTrainUtil, 'findTrainByNumber').mockImplementation(() => {
				throw new TgError('Нет данных');
			});
			await expect(
				service.handleWriteDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('not text in message', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? delete mockSceneContext.message.text
				: mockSceneContext;
			await expect(
				service.handleWriteDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('error found user', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'sdaadasd')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({} as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockImplementation(() => {
				throw new TgError('Нет данных');
			});
			await expect(
				service.handleWriteDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});

		it('good req', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'sdaadasd')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({} as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockResolvedValueOnce({} as User);
			await expect(
				service.handleWriteDescriptionInput(mockContext, mockSceneContext)
			).resolves.not.toThrow();
			expect(mockSceneContext.reply).toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).not.toHaveBeenCalled();
		});

		it('error create createConsumption', async () => {
			mockContext.session.trip.trainNumber = '633';
			mockContext.session.trip.carriage = '8';
			mockContext.session.trip.fuel = '456';
			'text' in mockSceneContext.message
				? (mockSceneContext.message.text = 'sdaadasd')
				: mockSceneContext;
			jest
				.spyOn(mockTrainUtil, 'findTrainByNumber')
				.mockResolvedValueOnce({} as Train);
			jest.spyOn(mockUserUtil, 'getUserById').mockResolvedValueOnce({} as User);
			jest
				.spyOn(mockConsumptionRepository, 'createConsumption')
				.mockImplementation(() => {
					throw new TgError('Нет данных');
				});
			await expect(
				service.handleWriteDescriptionInput(mockContext, mockSceneContext)
			).rejects.toThrow('');
			expect(mockSceneContext.reply).not.toHaveBeenCalled();
			expect(mockErrorHandlerService.handleError).toHaveBeenCalled();
		});
	});
});
