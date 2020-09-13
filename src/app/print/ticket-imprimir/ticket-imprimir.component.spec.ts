import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketImprimirComponent } from './ticket-imprimir.component';

describe('TicketImprimirComponent', () => {
  let component: TicketImprimirComponent;
  let fixture: ComponentFixture<TicketImprimirComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TicketImprimirComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TicketImprimirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
