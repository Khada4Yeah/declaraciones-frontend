import { Injectable } from '@angular/core';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private tokenExpirationSubject = new BehaviorSubject<boolean>(false);
  tokenExpiration$ = this.tokenExpirationSubject.asObservable();

  constructor() { }

  guardarToken(token: string) {
    const expirationTime = 60 * 60 * 1000; // 60 minutos en milisegundos
    const expirationDate = new Date(new Date().getTime() + expirationTime);
    setCookie('token-app', token, { expires: expirationDate, path: '/' });

    this.iniciaConteoExpiracionToken(expirationTime);
  }

  obtenerToken() {
    const token = getCookie('token-app');
    return token ? token : null;
  }

  removerToken() {
    removeCookie('token-app');
    this.tokenExpirationSubject.next(true); // Notifica que el token ha expirado
  }

  tokenValido(): boolean {
    return this.obtenerToken() ? true : false;
  }

  private iniciaConteoExpiracionToken(expirationTime: number) {
    setTimeout(() => {
      this.removerToken();
    }, expirationTime);

    this.tokenExpirationSubject.next(false); // Resetear el estado a no expirado
  }

  monitorExpiracionToken(): Observable<boolean> {
    return this.tokenExpiration$.pipe(
      take(1),
      map(expired => {
        if (expired) {
          this.removerToken();
          return true; // Token ha expirado
        }
        return false; // Token aún es válido
      })
    );
  }
}