import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportesDashboardComponent } from './reportes-dashboard.component';

describe('ReportesDashboardComponent', () => {
  let component: ReportesDashboardComponent;
  let fixture: ComponentFixture<ReportesDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportesDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportesDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
