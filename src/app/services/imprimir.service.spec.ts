import { TestBed } from '@angular/core/testing';

import { ImprimirService } from './imprimir.service';

describe('ImprimirService', () => {
  let service: ImprimirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImprimirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
