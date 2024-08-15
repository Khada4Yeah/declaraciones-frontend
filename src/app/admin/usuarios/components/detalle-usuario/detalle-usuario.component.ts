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
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { ModalService } from '../../../../core/services/modal.service';

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
  private personaNaturalService = inject(PersonaNaturalService);
  private personaJuridicaService = inject(PersonaJuridicaService);
  private modalService = inject(ModalService);

  constructor() { }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void { }

  cerrarModalUsuario(): void {
    this.cerrarModal.emit(false);
  }

  editarUsuario(): void {
    if (this.personaNatural || this.personaJuridica) {
      let id: string | null = null;

      if (this.personaNatural) {
        id = this.encriptacionService.encriptar(
          this.personaNatural.id_persona_natural.toString()
        );
      } else if (this.personaJuridica) {
        id = this.encriptacionService.encriptar(
          this.personaJuridica.id_persona_juridica.toString()
        );
      }

      if (id) {
        this.router.navigate(['admin', 'usuarios', 'editar-usuario', id], {
          queryParams: {
            tipoPersona: this.personaNatural ? 'natural' : 'juridica',
          },
        });
      } else {
        console.error('Error al obtener el usuario');
      }
    }
  }

  eliminarUsuario(): boolean {
    if (this.personaNatural || this.personaJuridica) {

      if (this.personaNatural) {
        this.personaNaturalService
          .eliminarPersonaNatural(this.personaNatural.id_persona_natural)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.cerrarModalUsuario();
              console.log('aqui');

              this.modalService.mostrar(
                'success',
                'Usuario eliminado correctamente', undefined, true
              );
            },
            error: () => {
              this.modalService.mostrar('error', "No se pudo eliminar el usuario");
            },
          });
      }

      if (this.personaJuridica) {
        console.log('entra aqui');
        console.log(this.personaJuridica);

        this.personaJuridicaService
          .eliminarPersonaJuridica(this.personaJuridica.id_persona_juridica)
          .subscribe({
            next: (res) => {
              console.log(res);
              this.cerrarModalUsuario();
              this.modalService.mostrar(
                'success',
                'Usuario eliminado correctamente', undefined, true
              );
            },
            error: () => {
              this.modalService.mostrar('error', "No se pudo eliminar el usuario");
            },
          },
          );
      }
    }
    return false;
  }
}
