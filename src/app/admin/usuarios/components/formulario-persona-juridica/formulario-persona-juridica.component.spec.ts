import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPersonaJuridicaComponent } from './formulario-persona-juridica.component';

describe('FormularioPersonaJuridicaComponent', () => {
  let component: FormularioPersonaJuridicaComponent;
  let fixture: ComponentFixture<FormularioPersonaJuridicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPersonaJuridicaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioPersonaJuridicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
