import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturasAnormalesComponent } from './lecturas-anormales.component';

describe('LecturasAnormalesComponent', () => {
  let component: LecturasAnormalesComponent;
  let fixture: ComponentFixture<LecturasAnormalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LecturasAnormalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturasAnormalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
