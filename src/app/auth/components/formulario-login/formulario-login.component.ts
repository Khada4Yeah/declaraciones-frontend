import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { EstadoSolicitud } from '../../../core/models/request-status.model';
import { AuthService } from '../../services/auth.service';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-formulario-login',
  templateUrl: './formulario-login.component.html',
  styleUrl: './formulario-login.component.scss',
})
export class FormularioLoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private modalService = inject(ModalService);
  private authService = inject(AuthService);

  formularioLogin!: FormGroup;
  paginaCargada: boolean = false;
  contrasenaVisible: boolean = false;
  estado: EstadoSolicitud = 'inicial';

  constructor() {
    this.construirFormulario();
  }

  ngOnInit(): void {
    this.paginaCargada = true;
  }

  private construirFormulario() {
    this.formularioLogin = this.formBuilder.group({
      correo_electronico: [null, [Validators.required, Validators.email]],
      clave: [null, [Validators.required]],
    });
  }

  iniciarSesion() {
    this.estado = 'cargando';
    if (this.formularioLogin.valid) {
      this.authService.iniciarSesion(this.formularioLogin.value).subscribe({
        next: () => {
          this.estado = 'exitoso';
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.estado = 'fallido';
          this.modalService.mostrar(
            'error',
            this.modalService.formateoErrores(error.error)
          );
        },
      });
    }
  }
}
