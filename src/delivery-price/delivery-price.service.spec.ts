import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryPriceService } from './delivery-price.service';

describe('DeliveryPriceService', () => {
  let service: DeliveryPriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DeliveryPriceService],
    }).compile();

    service = module.get<DeliveryPriceService>(DeliveryPriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
