import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.scss'
})
export class CrearUsuarioComponent {
  tipoPersona: 'personaN' | 'personaJ' = 'personaN';

  seleccionarTipo(tipo: 'personaN' | 'personaJ'): void {
    this.tipoPersona = tipo;
  }
}
