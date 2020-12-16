import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalDeContratosComponent } from './total-de-contratos.component';

describe('TotalDeContratosComponent', () => {
  let component: TotalDeContratosComponent;
  let fixture: ComponentFixture<TotalDeContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotalDeContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalDeContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
