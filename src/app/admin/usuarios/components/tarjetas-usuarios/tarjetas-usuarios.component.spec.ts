import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetasUsuariosComponent } from './tarjetas-usuarios.component';

describe('TarjetasUsuariosComponent', () => {
  let component: TarjetasUsuariosComponent;
  let fixture: ComponentFixture<TarjetasUsuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasUsuariosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarjetasUsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
