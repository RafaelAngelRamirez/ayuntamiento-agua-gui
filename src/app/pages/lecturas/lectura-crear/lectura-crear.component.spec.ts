import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LecturaCrearComponent } from './lectura-crear.component';

describe('LecturaCrearComponent', () => {
  let component: LecturaCrearComponent;
  let fixture: ComponentFixture<LecturaCrearComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LecturaCrearComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LecturaCrearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
