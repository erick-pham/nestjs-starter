import { Test, TestingModule } from '@nestjs/testing';
import { CoindeskController } from './coindesk.controller';

describe('CoindeskController', () => {
  let controller: CoindeskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoindeskController]
    }).compile();

    controller = module.get<CoindeskController>(CoindeskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
