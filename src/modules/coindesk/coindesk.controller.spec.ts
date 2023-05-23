import { Test, TestingModule } from '@nestjs/testing';
import { CoindeskController } from './coindesk.controller';
import { HttpModule } from '@nestjs/axios';
import { CoindeskService } from './coindesk.service';

describe('CoindeskController', () => {
  let controller: CoindeskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      controllers: [CoindeskController],
      providers: [CoindeskService]
    }).compile();

    controller = module.get<CoindeskController>(CoindeskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
