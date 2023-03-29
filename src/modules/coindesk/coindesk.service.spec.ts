import { Test, TestingModule } from '@nestjs/testing';
import { CoindeskService } from './coindesk.service';

describe('ApiService', () => {
  let service: CoindeskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoindeskService]
    }).compile();

    service = module.get<CoindeskService>(CoindeskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
