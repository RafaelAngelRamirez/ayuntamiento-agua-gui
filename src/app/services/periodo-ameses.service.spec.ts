import { TestBed } from '@angular/core/testing';

import { PeriodoAMesesService } from './periodo-ameses.service';

describe('PeriodoAMesesService', () => {
  let service: PeriodoAMesesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodoAMesesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
