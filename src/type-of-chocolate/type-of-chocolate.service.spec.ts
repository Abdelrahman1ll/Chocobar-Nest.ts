import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfChocolateService } from './type-of-chocolate.service';

describe('TypeOfChocolateService', () => {
  let service: TypeOfChocolateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypeOfChocolateService],
    }).compile();

    service = module.get<TypeOfChocolateService>(TypeOfChocolateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
