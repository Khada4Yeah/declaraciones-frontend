import { Component } from '@angular/core';

@Component({
  selector: 'app-crear-usuario',
  templateUrl: './crear-usuario.component.html',
  styleUrl: './crear-usuario.component.scss'
})
export class CrearUsuarioComponent {
  tipoPersona: string | null;

  constructor() {
    this.tipoPersona = null;
  }

}
