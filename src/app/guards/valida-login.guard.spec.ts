import { TestBed } from '@angular/core/testing';

import { ValidaLoginGuard } from './valida-login.guard';

describe('ValidaLoginGuard', () => {
  let guard: ValidaLoginGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidaLoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
