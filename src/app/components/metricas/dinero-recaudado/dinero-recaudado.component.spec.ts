import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DineroRecaudadoComponent } from './dinero-recaudado.component';

describe('DineroRecaudadoComponent', () => {
  let component: DineroRecaudadoComponent;
  let fixture: ComponentFixture<DineroRecaudadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DineroRecaudadoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DineroRecaudadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
