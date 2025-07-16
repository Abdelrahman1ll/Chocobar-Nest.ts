import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPriceController } from './delivery-price.controller';
import { DeliveryPriceService } from './delivery-price.service';

describe('DeliveryPriceController', () => {
  let controller: DeliveryPriceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryPriceController],
      providers: [DeliveryPriceService],
    }).compile();

    controller = module.get<DeliveryPriceController>(DeliveryPriceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
