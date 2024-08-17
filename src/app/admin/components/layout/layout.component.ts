import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';
import { EstadoSolicitud } from '../../../core/models/request-status.model';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isCollapsed: boolean;
  estado: EstadoSolicitud = "inicial";

  constructor() {
    this.isCollapsed = false;
  }

  cerrarSesion(): void {
    this.estado = 'cargando';
    this.authService.cerrarSesion().subscribe(
      {
        next: () => {
          this.estado = 'exitoso';
        },
        error: () => {
          this.router.navigate(['auth']);
        },
        complete: () => {
          this.estado = 'exitoso';
          this.router.navigate(['auth']);
        }
      }
    );
  }



}
