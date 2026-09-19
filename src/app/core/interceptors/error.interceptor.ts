import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';

/**
 * Interceptor de errores HTTP centralizado.
 * Maneja los errores de autenticación (401) y los errores del servidor (500).
 * Redirige al login cuando el token es inválido o ha expirado.
 */
export const errorInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          // Token inválido o expirado: limpiar token y redirigir al login
          tokenService.removerToken();
          router.navigate(['/auth/login']);
          break;

        case 403:
          // Sin permisos
          console.error('Acceso denegado:', error.url);
          break;

        case 0:
          // Error de red o servidor caído
          console.error('Error de conexión con el servidor');
          break;
      }

      return throwError(() => error);
    }),
  );
};