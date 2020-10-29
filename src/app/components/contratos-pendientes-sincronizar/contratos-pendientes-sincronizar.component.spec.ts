import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosPendientesSincronizarComponent } from './contratos-pendientes-sincronizar.component';

describe('ContratosPendientesSincronizarComponent', () => {
  let component: ContratosPendientesSincronizarComponent;
  let fixture: ComponentFixture<ContratosPendientesSincronizarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratosPendientesSincronizarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratosPendientesSincronizarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
