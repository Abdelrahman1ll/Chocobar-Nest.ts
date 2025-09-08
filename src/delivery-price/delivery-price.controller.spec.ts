import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPriceController } from './delivery-price.controller';
import { DeliveryPriceService } from './delivery-price.service';
import { getModelToken } from '@nestjs/mongoose';

describe('DeliveryPriceController', () => {
  let controller: DeliveryPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryPriceController],
      providers: [
        DeliveryPriceService,
        {
          provide: getModelToken('DeliveryPrice'), // اسم الـ Model
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DeliveryPriceController>(DeliveryPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
