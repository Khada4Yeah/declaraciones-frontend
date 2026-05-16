// detalle-usuario.component.ts
import {
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { PersonaJuridica } from '../../models/persona-juridica.model';
import { PersonaNatural } from '../../models/persona-natural.model';
import { Router } from '@angular/router';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { ModalService } from '../../../../core/services/modal.service';

/**
 * Componente que muestra los detalles de un usuario (persona natural o jurídica)
 * en un modal. Permite editar y eliminar el usuario.
 */
@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle-usuario.component.html',
  styleUrls: ['./detalle-usuario.component.scss'],
})
export class DetalleUsuarioComponent {
  personaNatural: PersonaNatural | null = null;
  personaJuridica: PersonaJuridica | null = null;
  cargando: boolean = false;
  errorCarga: boolean = false;

  @Input() set personaNaturalInput(val: PersonaNatural | null) {
    if (val) {
      this.cargando = true;
      this.errorCarga = false;
      this.personaNaturalService.obtenerPersonaNatural(val.id_persona_natural).subscribe({
        next: (data) => {
          this.personaNatural = data;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
          this.errorCarga = true;
          this.modalService.mostrar('error', 'No se pudieron cargar los detalles');
        }
      });
    } else {
      this.personaNatural = null;
    }
  }

  @Input() set personaJuridicaInput(val: PersonaJuridica | null) {
    if (val) {
      this.cargando = true;
      this.errorCarga = false;
      this.personaJuridicaService.obtenerPersonaJuridica(val.id_persona_juridica).subscribe({
        next: (data) => {
          this.personaJuridica = data;
          this.cargando = false;
        },
        error: () => {
          this.cargando = false;
          this.errorCarga = true;
          this.modalService.mostrar('error', 'No se pudieron cargar los detalles');
        }
      });
    } else {
      this.personaJuridica = null;
    }
  }

  @Input() modalVisible: boolean = false;
  @Output() cerrarModal: EventEmitter<boolean> = new EventEmitter<boolean>();

  private router = inject(Router);
  private personaNaturalService = inject(PersonaNaturalService);
  private personaJuridicaService = inject(PersonaJuridicaService);
  private modalService = inject(ModalService);

  /**
   * Cierra el modal de detalle emitiendo el evento correspondiente.
   */
  cerrarModalUsuario(): void {
    this.cerrarModal.emit(false);
  }

  /**
   * Navega a la página de edición del usuario actual.
   * Utiliza el ID directo sin encriptación en la URL.
   */
  editarUsuario(): void {
    if (this.personaNatural || this.personaJuridica) {
      let id: number | null = null;
      let tipoPersona = '';

      if (this.personaNatural) {
        id = this.personaNatural.id_persona_natural;
        tipoPersona = 'natural';
      } else if (this.personaJuridica) {
        id = this.personaJuridica.id_persona_juridica;
        tipoPersona = 'juridica';
      }

      if (id) {
        this.router.navigate(['admin', 'usuarios', 'editar-usuario', id], {
          queryParams: { tipoPersona },
        });
      }
    }
  }

  /**
   * Elimina el usuario actual (persona natural o jurídica).
   * Muestra un modal de confirmación antes de la eliminación.
   */
  eliminarUsuario(): void {
    if (this.personaNatural) {
      this.personaNaturalService
        .eliminarPersonaNatural(this.personaNatural.id_persona_natural)
        .subscribe({
          next: () => {
            this.cerrarModalUsuario();
            this.modalService.mostrar(
              'success',
              'Usuario eliminado correctamente', undefined, true
            );
          },
          error: () => {
            this.modalService.mostrar('error', 'No se pudo eliminar el usuario');
          },
        });
    }

    if (this.personaJuridica) {
      this.personaJuridicaService
        .eliminarPersonaJuridica(this.personaJuridica.id_persona_juridica)
        .subscribe({
          next: () => {
            this.cerrarModalUsuario();
            this.modalService.mostrar(
              'success',
              'Usuario eliminado correctamente', undefined, true
            );
          },
          error: () => {
            this.modalService.mostrar('error', 'No se pudo eliminar el usuario');
          },
        });
    }
  }
}
