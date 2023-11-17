import { Test, TestingModule } from '@nestjs/testing';
import { CarAccidentService } from './car-accident.service';

describe('CarAccidentService', () => {
  let service: CarAccidentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarAccidentService],
    }).compile();

    service = module.get<CarAccidentService>(CarAccidentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
