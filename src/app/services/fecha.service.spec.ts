import { TestBed } from '@angular/core/testing';

import { FechaService } from './fecha.service';

describe('FechaService', () => {
  let service: FechaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FechaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
