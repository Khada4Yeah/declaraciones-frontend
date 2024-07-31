// detalle-usuario.component.ts
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { PersonaJuridica } from '../../models/persona-juridica.model';
import { PersonaNatural } from '../../models/persona-natural.model';
import { Router } from '@angular/router';
import { EncriptacionService } from '../../../../core/services/encriptacion.service';

@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss'],
})
export class DetalleUsuarioComponent implements OnInit {
  @Input() personaNatural: PersonaNatural | null = null;
  @Input() personaJuridica: PersonaJuridica | null = null;
  @Input() modalVisible: boolean = false;
  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  private router = inject(Router);
  private encriptacionService = inject(EncriptacionService);

  constructor() { }

  ngOnInit(): void {
    console.log('personaNatural', this.personaNatural);

  }

  cerrarModalUsuario(): void {
    this.cerrarModal.emit(false);
  }


  editarUsuario(): void {
    if (this.personaNatural || this.personaJuridica) {
      let id: string | null = null;

      if (this.personaNatural) {
        id = this.encriptacionService.encriptar(this.personaNatural.id_persona_natural.toString());
      } else if (this.personaJuridica) {
        id = this.encriptacionService.encriptar(this.personaJuridica.id_persona_juridica.toString());
      }

      if (id) {

        this.router.navigate(
          ['admin', 'usuarios', 'editar-usuario', id],
          {
            queryParams: {
              tipoPersona: this.personaNatural ? 'natural' : 'juridica',
            },
          }
        );
      } else {
        console.error('Error al obtener el usuario');
      }
    }
  }
}
