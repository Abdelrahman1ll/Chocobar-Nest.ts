import { Test, TestingModule } from '@nestjs/testing';
import { TypeOfChocolateController } from './type-of-chocolate.controller';
import { TypeOfChocolateService } from './type-of-chocolate.service';
import { getModelToken } from '@nestjs/mongoose'; // مهم جداً

describe('TypeOfChocolateController', () => {
  let controller: TypeOfChocolateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeOfChocolateController],
      providers: [
        TypeOfChocolateService,
        {
          provide: getModelToken('TypeOfChocolate'), // اسم الـ Model نفسه
          useValue: {
            new: jest.fn().mockResolvedValue({}),
            constructor: jest.fn().mockResolvedValue({}),
            find: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TypeOfChocolateController>(
      TypeOfChocolateController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
