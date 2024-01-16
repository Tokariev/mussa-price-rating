import { Test, TestingModule } from '@nestjs/testing';
import { PriceHistoryService } from './price-history.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('ParserService', () => {
  let service: PriceHistoryService;
  const mockEventEmitter2 = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceHistoryService,
        {
          provide: EventEmitter2,
          useValue: mockEventEmitter2,
        },
      ],
    }).compile();

    service = module.get<PriceHistoryService>(PriceHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should return ID 382340166', async () => {
    const sourceUrl =
      'https://suchen.mobile.de/fahrzeuge/details.html?id=382340166&utm_source=com.apple.UIKit.activity.CopyToPasteboard&utm_medium=ios';

    const result = service.extractMobileDeId(sourceUrl);

    expect(result).toBe('382340166');
  });

  it('Should return ID 382340166', async () => {
    const sourceUrl =
      'https://suchen.mobile.de/auto-inserat/bmw-125i-m-sport-a-m-sport-m%C3%BCnchen/382340166.html?source=api';

    const result = service.extractMobileDeId(sourceUrl);

    expect(result).toBe('382340166');
  });
});
