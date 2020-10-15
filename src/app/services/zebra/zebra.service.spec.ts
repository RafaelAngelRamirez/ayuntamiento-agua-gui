import { TestBed } from '@angular/core/testing';

import { ZebraService } from './zebra.service';

describe('ZebraService', () => {
  let service: ZebraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZebraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
