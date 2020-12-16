import { TestBed } from '@angular/core/testing';

import { MetricasService } from './metricas.service';

describe('MetricasService', () => {
  let service: MetricasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MetricasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
