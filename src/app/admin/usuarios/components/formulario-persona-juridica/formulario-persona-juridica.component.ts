import { Component, inject, OnInit } from '@angular/core';
import { PersonaJuridicaService } from '../../services/persona-juridica.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstadoSolicitud } from '../../../../core/models/request-status.model';
import { PersonaJuridica } from '../../models/persona-juridica.model';
import { ActivatedRoute } from '@angular/router';
import { EncriptacionService } from '../../../../core/services/encriptacion.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-formulario-persona-juridica',
  templateUrl: './formulario-persona-juridica.component.html',
  styleUrl: './formulario-persona-juridica.component.scss'
})
export class FormularioPersonaJuridicaComponent implements OnInit {
  private personaJuridicaService = inject(PersonaJuridicaService);
  private encriptacionService = inject(EncriptacionService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(ModalService);
  private route = inject(ActivatedRoute);

  paginaCargada: boolean;
  formularioPersonaJuridica!: FormGroup;
  estado: EstadoSolicitud;
  personaJuridica!: PersonaJuridica;
  idPersonaJuridica: number | null;

  constructor() {
    this.paginaCargada = false;
    this.estado = 'inicial';
    this.idPersonaJuridica = null;
    this.construirFormulario();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const idEncriptado = params.get('id');
      if (idEncriptado) {
        this.idPersonaJuridica = Number(this.encriptacionService.desencriptar(idEncriptado));
      }
      if (this.idPersonaJuridica !== null) {
        this.cargarPersonaJuridica();
      }
      else {
        this.paginaCargada = true;
      }
    });
  }

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

  private cargarPersonaJuridica(): void {
    if (this.idPersonaJuridica) {
      this.personaJuridicaService.obtenerPersonaJuridica(this.idPersonaJuridica).subscribe({
        next: (personaJuridica: PersonaJuridica) => {
          this.personaJuridica = personaJuridica;
          this.formularioPersonaJuridica.patchValue(personaJuridica);
          // asignar valor a los campos correo_electronico y celular
          this.formularioPersonaJuridica.get('correo_electronico')?.setValue(personaJuridica.usuario.correo_electronico);
          this.formularioPersonaJuridica.get('celular')?.setValue(personaJuridica.usuario.celular);
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.paginaCargada = true;
        }
      });
    }
  }

  guardarPersonaJuridica() {
    this.estado = 'cargando';
    if (this.formularioPersonaJuridica.valid) {
      if (this.idPersonaJuridica) {
        this.personaJuridicaService.actualizarPersonaJuridica(this.idPersonaJuridica, this.formularioPersonaJuridica.value).subscribe({
          next: () => {
            this.estado = "exitoso";
            this.modalService.mostrar('success', 'Usuario actualizado exitosamente', '/admin/usuarios/lista-usuarios');
            console.log('Usuario actualizado exitosamente');

          },
          error: (error) => {
            this.estado = "fallido";
            this.modalService.mostrar('error', this.modalService.formateoErrores(error.error));
          }
        });
      }
      else {
        this.personaJuridicaService.crearPersonaJuridica(this.formularioPersonaJuridica.value).subscribe({
          next: () => {
            this.estado = "exitoso";
            this.modalService.mostrar('success', 'Usario creado exitosamente', '/admin/usuarios/lista-usuarios');
          },
          error: (error) => {
            this.estado = "fallido";
            this.modalService.mostrar('error', this.modalService.formateoErrores(error.error));
          }
        });
      }
    }
  }

}
