import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoSolicitud } from '../../../../core/models/request-status.model';
import { PersonaJuridica } from '../../models/persona-juridica.model';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ModalService } from '../../../../core/services/modal.service';

/**
 * Componente de formulario para crear y editar personas jurídicas.
 * Detecta automáticamente el modo (creación o edición) según los parámetros de la URL.
 */
@Component({
  selector: 'app-formulario-persona-juridica',
  templateUrl: './formulario-persona-juridica.component.html',
  styleUrl: './formulario-persona-juridica.component.scss'
})
export class FormularioPersonaJuridicaComponent implements OnInit {
  private personaJuridicaService = inject(PersonaJuridicaService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(ModalService);
  private route = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  paginaCargada = false;
  formularioPersonaJuridica!: FormGroup;
  estado: EstadoSolicitud = 'inicial';
  personaJuridica!: PersonaJuridica;
  idPersonaJuridica: number | null = null;

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
        const idEncriptado = params.get('id');
        if (idEncriptado) {
          this.idPersonaJuridica = Number(idEncriptado);
        }
        if (this.idPersonaJuridica !== null) {
          this.cargarPersonaJuridica();
        } else {
          this.paginaCargada = true;
        }
      });
  }

  /**
   * Construye el formulario reactivo con las validaciones necesarias.
   */
  private construirFormulario(): void {
    this.formularioPersonaJuridica = this.formBuilder.group({
      correo_electronico: [null, [Validators.required, Validators.email]],
      ruc: [null, [Validators.required, Validators.pattern(/^\d{13}$/)]],
      razon_social: [null, [Validators.required]],
      celular: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      clave_acceso: [null, [Validators.required]],
      informacion_adicional: [null],
    });
  }

  /**
   * Carga los datos de la persona jurídica desde el backend para modo edición.
   * Rellena el formulario con los datos obtenidos.
   */
  private cargarPersonaJuridica(): void {
    if (this.idPersonaJuridica) {
      this.personaJuridicaService.obtenerPersonaJuridica(this.idPersonaJuridica).subscribe({
        next: (personaJuridica: PersonaJuridica) => {
          this.personaJuridica = personaJuridica;
          this.formularioPersonaJuridica.patchValue(personaJuridica);
          this.formularioPersonaJuridica.get('correo_electronico')?.setValue(personaJuridica.usuario.correo_electronico);
          this.formularioPersonaJuridica.get('celular')?.setValue(personaJuridica.usuario.celular);
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
   * Guarda la persona jurídica (crea o actualiza según el modo).
   * Muestra feedback al usuario mediante modales.
   */
  guardarPersonaJuridica(): void {
    this.estado = 'cargando';
    if (this.formularioPersonaJuridica.valid) {
      if (this.idPersonaJuridica) {
        this.personaJuridicaService.actualizarPersonaJuridica(this.idPersonaJuridica, this.formularioPersonaJuridica.value).subscribe({
          next: () => {
            this.estado = 'exitoso';
            this.modalService.mostrar('success', 'Usuario actualizado exitosamente', '/admin/usuarios/lista-usuarios');
          },
          error: (error) => {
            this.estado = 'fallido';
            this.modalService.mostrar('error', this.modalService.formateoErrores(error.error));
          }
        });
      } else {
        this.personaJuridicaService.crearPersonaJuridica(this.formularioPersonaJuridica.value).subscribe({
          next: () => {
            this.estado = 'exitoso';
            this.modalService.mostrar('success', 'Usuario creado exitosamente', '/admin/usuarios/lista-usuarios');
          },
          error: (error) => {
            this.estado = 'fallido';
            this.modalService.mostrar('error', this.modalService.formateoErrores(error.error));
          }
        });
      }
    }
  }
}
