import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContratosOnlineComponent } from './contratos-online.component';

describe('ContratosOnlineComponent', () => {
  let component: ContratosOnlineComponent;
  let fixture: ComponentFixture<ContratosOnlineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContratosOnlineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContratosOnlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
