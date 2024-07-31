import { TestBed } from '@angular/core/testing';

import { HourlyDataService } from './hourly-data.service';

describe('HourlyDataService', () => {
  let service: HourlyDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HourlyDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
