import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../../../core/services/modal.service';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { EstadoSolicitud } from '../../../../core/models/request-status.model';
import { PersonaNatural } from '../../models/persona-natural.model';

/**
 * Componente de formulario para crear y editar personas naturales.
 * Detecta automáticamente el modo (creación o edición) según los parámetros de la URL.
 */
@Component({
  selector: 'app-formulario-persona-natural',
  templateUrl: './formulario-persona-natural.component.html',
  styleUrl: './formulario-persona-natural.component.scss'
})
export class FormularioPersonaNaturalComponent implements OnInit {
  private personaNaturalService = inject(PersonaNaturalService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(ModalService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  paginaCargada = false;
  formularioPersonaNatural!: FormGroup;
  estado: EstadoSolicitud = 'inicial';
  personaNatural!: PersonaNatural;
  idPersonaNatural: number | null = null;

  constructor() {
    this.construirFormulario();
  }

  /**
   * Obtiene el ID de los parámetros de la URL y carga los datos si es modo edición.
   * Utiliza takeUntilDestroyed para evitar memory leaks.
   */
  ngOnInit(): void {
    this.route.paramMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const id = params.get('id');
        if (id) {
          this.idPersonaNatural = Number(id);
        }
        if (this.idPersonaNatural !== null) {
          this.cargarPersonaNatural();
        } else {
          this.paginaCargada = true;
        }
      });
  }

  /**
   * Construye el formulario reactivo con las validaciones necesarias.
   */
  private construirFormulario(): void {
    this.formularioPersonaNatural = this.formBuilder.group({
      correo_electronico: [null, [Validators.required, Validators.email]],
      identificacion: [null, [Validators.required, Validators.pattern(/^\d{10}$|^\d{13}$/)]],
      nombres: [null, [Validators.required]],
      apellido_p: [null],
      apellido_m: [null],
      celular: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      clave_acceso: [null, [Validators.required]],
      informacion_adicional: [null],
    });
  }

  /**
   * Carga los datos de la persona natural desde el backend para modo edición.
   * Rellena el formulario con los datos obtenidos.
   */
  private cargarPersonaNatural(): void {
    if (this.idPersonaNatural) {
      this.personaNaturalService.obtenerPersonaNatural(this.idPersonaNatural).subscribe({
        next: (personaNatural: PersonaNatural) => {
          this.personaNatural = personaNatural;
          this.formularioPersonaNatural.patchValue(personaNatural);
          this.formularioPersonaNatural.get('correo_electronico')?.setValue(personaNatural.usuario.correo_electronico);
          this.formularioPersonaNatural.get('celular')?.setValue(personaNatural.usuario.celular);
        },
        error: () => {
          this.modalService.mostrar('error', 'No se pudieron cargar los datos');
        },
        complete: () => {
          this.paginaCargada = true;
        }
      });
    }
  }

  /**
   * Guarda la persona natural (crea o actualiza según el modo).
   * Muestra feedback al usuario mediante modales.
   */
  guardarPersonaNatural(): void {
    this.estado = 'cargando';

    if (this.formularioPersonaNatural.valid) {
      if (this.idPersonaNatural) {
        this.personaNaturalService.actualizarPersonaNatural(this.idPersonaNatural, this.formularioPersonaNatural.value).subscribe({
          next: (personaNatural: PersonaNatural) => {
            this.personaNatural = personaNatural;
            this.modalService.mostrar('success', 'Usuario actualizado exitosamente', '/admin/usuarios/lista-usuarios');
          },
          error: (error) => {
            this.estado = 'fallido';
            this.modalService.mostrar('error', this.modalService.formateoErrores(error.error));
          },
          complete: () => {
            this.estado = 'exitoso';
          }
        });
      } else {
        this.personaNaturalService.crearPersonaNatural(this.formularioPersonaNatural.value).subscribe({
          next: (personaNatural: PersonaNatural) => {
            this.personaNatural = personaNatural;
            this.modalService.mostrar('success', 'Usuario creado exitosamente', '/admin/usuarios/lista-usuarios');
          },
          error: (error) => {
            this.estado = 'fallido';
            this.modalService.mostrar('error', this.modalService.formateoErrores(error.error));
          },
          complete: () => {
            this.estado = 'exitoso';
          }
        });
      }
    }
  }
}
