import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaDetalleComponent } from './lectura-detalle.component';

describe('LecturaDetalleComponent', () => {
  let component: LecturaDetalleComponent;
  let fixture: ComponentFixture<LecturaDetalleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturaDetalleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
