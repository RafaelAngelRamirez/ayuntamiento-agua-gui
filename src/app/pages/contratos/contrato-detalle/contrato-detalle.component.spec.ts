import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratoDetalleComponent } from './contrato-detalle.component';

describe('ContratoDetalleComponent', () => {
  let component: ContratoDetalleComponent;
  let fixture: ComponentFixture<ContratoDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratoDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratoDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
