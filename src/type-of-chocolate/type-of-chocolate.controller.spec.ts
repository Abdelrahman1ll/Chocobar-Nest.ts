import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfChocolateController } from './type-of-chocolate.controller';
import { TypeOfChocolateService } from './type-of-chocolate.service';

describe('TypeOfChocolateController', () => {
  let controller: TypeOfChocolateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfChocolateController],
      providers: [TypeOfChocolateService],
    }).compile();

    controller = module.get<TypeOfChocolateController>(
      TypeOfChocolateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
