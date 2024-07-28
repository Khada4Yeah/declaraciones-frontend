import { Component, inject } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  isCollapsed: boolean;

  constructor() {
    this.isCollapsed = false;
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion().subscribe(
      {
        next: () => {
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.router.navigate(['/login']);
        }
      }
    );
  }



}
