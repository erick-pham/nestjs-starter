import { Test, TestingModule } from '@nestjs/testing';
import { CoindeskService } from './coindesk.service';
import { HttpModule } from '@nestjs/axios';

describe('ApiService', () => {
  let service: CoindeskService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [CoindeskService]
    }).compile();

    service = module.get<CoindeskService>(CoindeskService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
