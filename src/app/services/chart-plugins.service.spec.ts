import { TestBed } from '@angular/core/testing';

import { ChartPluginsService } from './chart-plugins.service';

describe('ChartPluginsService', () => {
  let service: ChartPluginsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChartPluginsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
