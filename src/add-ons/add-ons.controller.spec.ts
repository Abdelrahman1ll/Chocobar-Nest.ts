import { Test, TestingModule } from '@nestjs/testing';
import { AddOnsController } from './add-ons.controller';
import { AddOnsService } from './add-ons.service';

describe('AddOnsController', () => {
  let controller: AddOnsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddOnsController],
      providers: [AddOnsService],
    }).compile();

    controller = module.get<AddOnsController>(AddOnsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
