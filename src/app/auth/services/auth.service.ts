import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { Token } from '../../core/models/token.model';
import { checkToken } from '../../core/interceptors/token.interceptor';

/**
 * Servicio de autenticación.
 * Maneja el login, logout y monitoreo de expiración del token JWT.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  constructor() {
    this.apiUrl = environment.apiUrl + 'auth';
    this.monitorExpiracionToken();
  }

  /**
   * Inicia sesión con las credenciales proporcionadas.
   * Almacena el token recibido en una cookie.
   *
   * @param auth Credenciales de autenticación (correo y clave).
   * @returns Observable con el token y tiempo de expiración.
   */
  iniciarSesion(auth: Auth): Observable<Token> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Token>(`${this.apiUrl}/login`, auth, { headers }).pipe(
      tap((response: Token) => {
        this.tokenService.guardarToken(response.token);
      }),
    );
  }

  /**
   * Cierra la sesión del usuario actual.
   * Invalida el token en el backend y lo elimina de la cookie.
   *
   * @returns Observable que se completa al cerrar sesión.
   */
  cerrarSesion(): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/logout`, null, { context: checkToken() }).pipe(
      tap(() => {
        this.tokenService.removerToken();
      })
    );
  }

  /**
   * Monitorea la expiración del token JWT.
   * Cuando el token expira, cierra la sesión automáticamente.
   */
  private monitorExpiracionToken(): void {
    this.tokenService.monitorExpiracionToken().subscribe(expired => {
      if (expired) {
        this.cerrarSesion().subscribe();
      }
    });
  }
}
