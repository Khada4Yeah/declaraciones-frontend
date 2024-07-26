import { Injectable } from '@angular/core';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  guardarToken(token: string) {
    setCookie('token-app', token, { expires: 365, path: '/' });
  }

  obtenerToken() {
    const token = getCookie('token-app');
    return token ? token : null;
  }

  removerToken() {
    removeCookie('token-app');
  }

  tokenValido(): boolean {
    return this.obtenerToken() ? true : false;
  }
}