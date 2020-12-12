import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosMetricasComponent } from './filtros-metricas.component';

describe('FiltrosMetricasComponent', () => {
  let component: FiltrosMetricasComponent;
  let fixture: ComponentFixture<FiltrosMetricasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FiltrosMetricasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltrosMetricasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
