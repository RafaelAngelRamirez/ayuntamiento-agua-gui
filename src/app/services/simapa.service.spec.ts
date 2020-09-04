import { TestBed } from '@angular/core/testing';

import { SimapaService } from './simapa.service';

describe('SimapaService', () => {
  let service: SimapaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimapaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
