import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReciboNoExisteComponent } from './recibo-no-existe.component';

describe('ReciboNoExisteComponent', () => {
  let component: ReciboNoExisteComponent;
  let fixture: ComponentFixture<ReciboNoExisteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReciboNoExisteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReciboNoExisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
