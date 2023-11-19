import { Test, TestingModule } from '@nestjs/testing';
import { CarManagerService } from './car-manager.service';

describe('CarManagerService', () => {
  let service: CarManagerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarManagerService],
    }).compile();

    service = module.get<CarManagerService>(CarManagerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
