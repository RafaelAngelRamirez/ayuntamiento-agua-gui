import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ParametrosComponent } from './parametros.component';

describe('ParametrosComponent', () => {
  let component: ParametrosComponent;
  let fixture: ComponentFixture<ParametrosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ParametrosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParametrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
