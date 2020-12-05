import { TestBed } from '@angular/core/testing';

import { CalculosTicketService } from './calculos-ticket.service';

describe('CalculosTicketService', () => {
  let service: CalculosTicketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculosTicketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
