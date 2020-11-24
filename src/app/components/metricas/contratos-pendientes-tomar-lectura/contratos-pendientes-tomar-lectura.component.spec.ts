import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosPendientesTomarLecturaComponent } from './contratos-pendientes-tomar-lectura.component';

describe('ContratosPendientesTomarLecturaComponent', () => {
  let component: ContratosPendientesTomarLecturaComponent;
  let fixture: ComponentFixture<ContratosPendientesTomarLecturaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratosPendientesTomarLecturaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratosPendientesTomarLecturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
