import { Injectable } from '@angular/core';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { BehaviorSubject, Observable, filter, take } from 'rxjs';

/**
 * Servicio para gestionar el token de autenticación JWT.
 * Almacena el token en una cookie y monitorea su expiración.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenExpirationSubject = new BehaviorSubject<boolean>(false);
  private expirationTimerId: ReturnType<typeof setTimeout> | null = null;
  tokenExpiration$ = this.tokenExpirationSubject.asObservable();

  /**
   * Almacena el token JWT en una cookie con fecha de expiración.
   * Inicia un temporizador para notificar cuando expire.
   *
   * @param token Token JWT a almacenar.
   */
  guardarToken(token: string): void {
    const expirationTime = 60 * 60 * 1000; // 60 minutos en milisegundos
    const expirationDate = new Date(new Date().getTime() + expirationTime);

    const cookieOptions: { expires: Date; path: string; sameSite?: 'strict' | 'lax' | 'none'; secure?: boolean } = {
      expires: expirationDate,
      path: '/',
      sameSite: 'strict'
    };

    // En producción, agregar flag secure para HTTPS
    if (window.location.protocol === 'https:') {
      cookieOptions.secure = true;
    }

    setCookie('token-app', token, cookieOptions);
    this.iniciaConteoExpiracionToken(expirationTime);
  }

  /**
   * Obtiene el token JWT almacenado en la cookie.
   *
   * @returns Token JWT o null si no existe.
   */
  obtenerToken(): string | null {
    const token = getCookie('token-app');
    return token ? token : null;
  }

  /**
   * Remueve el token JWT de la cookie y notifica su expiración.
   * Limpia el temporizador activo si existe.
   */
  removerToken(): void {
    // Limpiar el temporizador anterior para evitar múltiples timeouts
    if (this.expirationTimerId) {
      clearTimeout(this.expirationTimerId);
      this.expirationTimerId = null;
    }

    removeCookie('token-app');
    this.tokenExpirationSubject.next(true);
  }

  /**
   * Verifica si existe un token JWT válido.
   *
   * @returns true si el token existe, false si no.
   */
  tokenValido(): boolean {
    return !!this.obtenerToken();
  }

  /**
   * Inicia un temporizador que remueve el token al expirar.
   * Limpia cualquier temporizador previo antes de crear uno nuevo.
   *
   * @param expirationTime Tiempo en milisegundos hasta la expiración.
   */
  private iniciaConteoExpiracionToken(expirationTime: number): void {
    // Limpiar temporizador anterior si existe
    if (this.expirationTimerId) {
      clearTimeout(this.expirationTimerId);
    }

    this.expirationTimerId = setTimeout(() => {
      this.removerToken();
    }, expirationTime);

    this.tokenExpirationSubject.next(false);
  }

  /**
   * Monitorea la expiración del token.
   * Se resuelve cuando el token expira (emite true).
   *
   * @returns Observable que emite true cuando el token ha expirado.
   */
  monitorExpiracionToken(): Observable<boolean> {
    return this.tokenExpiration$.pipe(
      filter(expired => expired),
      take(1)
    );
  }
}