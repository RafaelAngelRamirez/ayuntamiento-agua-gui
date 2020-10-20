import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioCrearModificarComponent } from './usuario-crear-modificar.component';

describe('UsuarioCrearModificarComponent', () => {
  let component: UsuarioCrearModificarComponent;
  let fixture: ComponentFixture<UsuarioCrearModificarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsuarioCrearModificarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioCrearModificarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
