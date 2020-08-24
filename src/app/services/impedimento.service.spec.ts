import { TestBed } from '@angular/core/testing';

import { ImpedimentoService } from './impedimento.service';

describe('ImpedimentoService', () => {
  let service: ImpedimentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImpedimentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
