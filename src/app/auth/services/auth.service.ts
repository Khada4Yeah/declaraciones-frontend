import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Auth } from '../models/auth.model';
import { Observable, tap } from 'rxjs';
import { TokenService } from '../../core/services/token.service';
import { Token } from '../../core/models/token.model';
import { checkToken } from '../../interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl: string;
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);

  constructor() {
    this.apiUrl = environment.apiUrl + 'auth';
  }

  iniciarSesion(auth: Auth): Observable<Token> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<Token>(`${this.apiUrl}/login`, auth, { headers }).pipe(
      tap((response: Token) => {
        this.tokenService.guardarToken(response.token);
      })
    );
  }

  cerrarSesion() {
    return this.http.post(`${this.apiUrl}/logout`, { context: checkToken() }).pipe(
      tap(() => {
        this.tokenService.removerToken();
      })
    );
  }

}
