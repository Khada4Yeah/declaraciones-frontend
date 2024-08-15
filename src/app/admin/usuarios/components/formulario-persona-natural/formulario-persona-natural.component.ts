import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EncriptacionService } from '../../../../core/services/encriptacion.service';
import { ModalService } from '../../../../core/services/modal.service';
import { PersonaNaturalService } from '../../services/persona-natural.service';
import { EstadoSolicitud } from '../../../../core/models/request-status.model';
import { PersonaNatural } from '../../models/persona-natural.model';

@Component({
  selector: 'app-formulario-persona-natural',
  templateUrl: './formulario-persona-natural.component.html',
  styleUrl: './formulario-persona-natural.component.scss'
})
export class FormularioPersonaNaturalComponent implements OnInit {
  private personaNaturalService = inject(PersonaNaturalService);
  private encriptacionService = inject(EncriptacionService);
  private formBuilder = inject(FormBuilder);
  private modalService = inject(ModalService);
  private route = inject(ActivatedRoute);

  paginaCargada: boolean;
  formularioPersonaNatural!: FormGroup;
  estado: EstadoSolicitud;
  personaNatural!: PersonaNatural;
  idPersonaNatural: number | null;

  constructor() {
    this.paginaCargada = false;
    this.estado = 'inicial';
    this.idPersonaNatural = null;
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idEncriptado = params.get('id');
      if (idEncriptado) {
        this.idPersonaNatural = Number(this.encriptacionService.desencriptar(idEncriptado));
      }
      if (this.idPersonaNatural !== null) {
        this.cargarPersonaNatural();
      }
      else {
        this.paginaCargada = true;
      }
    });
  }

  private construirFormulario(): void {
    this.formularioPersonaNatural = this.formBuilder.group({
      correo_electronico: [null, [Validators.required, Validators.email]],
      identificacion: [null, [Validators.required, Validators.pattern(/^\d{10}$|^\d{13}$/)]],
      nombres: [null, [Validators.required]],
      apellido_p: [null,],
      apellido_m: [null,],
      celular: [null, [Validators.required, Validators.pattern(/^\d{10}$/)]],
      clave_acceso: [null, [Validators.required]],
      informacion_adicional: [null],
    });
  }

  private cargarPersonaNatural(): void {
    if (this.idPersonaNatural) {
      this.personaNaturalService.obtenerPersonaNatural(this.idPersonaNatural).subscribe(
        {
          next: (personaNatural: PersonaNatural) => {
            this.personaNatural = personaNatural;
            this.formularioPersonaNatural.patchValue(personaNatural);
            this.formularioPersonaNatural.get('correo_electronico')?.setValue(personaNatural.usuario.correo_electronico);
            this.formularioPersonaNatural.get('celular')?.setValue(personaNatural.usuario.celular);
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

  guardarPersonaNatural(): void {
    this.estado = 'cargando';
    console.log(this.formularioPersonaNatural.value);

    if (this.formularioPersonaNatural.valid) {
      if (this.idPersonaNatural) {
        this.personaNaturalService.actualizarPersonaNatural(this.idPersonaNatural, this.formularioPersonaNatural.value).subscribe({
          next: (personaNatural: PersonaNatural) => {

            this.personaNatural = personaNatural;
            this.modalService.mostrar('success', 'Usuario actualizado exitosamente', '/admin/usuarios/lista-usuarios');
          },
          error: (error) => {
            this.estado = "fallido";
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
            console.log(error.error);
            this.modalService.mostrar('error', this.modalService.formateoErrores(error));
          },
          complete: () => {
            this.estado = 'exitoso';
          }
        });
      }
    }
  }
}
