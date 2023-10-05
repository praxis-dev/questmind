import { Test, TestingModule } from '@nestjs/testing';
import { RespondService } from './respond.service';

describe('RespondService', () => {
  let service: RespondService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RespondService],
    }).compile();

    service = module.get<RespondService>(RespondService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
