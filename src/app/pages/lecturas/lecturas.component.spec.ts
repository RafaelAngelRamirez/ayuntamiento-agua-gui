import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LecturasComponent } from './lecturas.component';

describe('LecturasComponent', () => {
  let component: LecturasComponent;
  let fixture: ComponentFixture<LecturasComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
