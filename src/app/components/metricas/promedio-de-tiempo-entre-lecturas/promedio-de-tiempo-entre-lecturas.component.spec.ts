import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromedioDeTiempoEntreLecturasComponent } from './promedio-de-tiempo-entre-lecturas.component';

describe('PromedioDeTiempoEntreLecturasComponent', () => {
  let component: PromedioDeTiempoEntreLecturasComponent;
  let fixture: ComponentFixture<PromedioDeTiempoEntreLecturasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromedioDeTiempoEntreLecturasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromedioDeTiempoEntreLecturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
