import { TestBed } from '@angular/core/testing';

import { EstaLogueadoGuard } from './esta-logueado.guard';

describe('EstaLogueadoGuard', () => {
  let guard: EstaLogueadoGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(EstaLogueadoGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
