import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LecturaCrearComponent } from './lectura-crear.component';

describe('LecturaCrearComponent', () => {
  let component: LecturaCrearComponent;
  let fixture: ComponentFixture<LecturaCrearComponent>;

  beforeEach(async(() => {
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
