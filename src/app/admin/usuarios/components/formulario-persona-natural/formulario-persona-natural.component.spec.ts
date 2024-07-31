import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPersonaNaturalComponent } from './formulario-persona-natural.component';

describe('FormularioPersonaNaturalComponent', () => {
  let component: FormularioPersonaNaturalComponent;
  let fixture: ComponentFixture<FormularioPersonaNaturalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPersonaNaturalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FormularioPersonaNaturalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
