import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CreatePersonaNaturalDTO, PersonaNatural } from '../models/persona-natural.model';
import { Observable } from 'rxjs';
import { checkToken } from '../../../core/interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class PersonaNaturalService {
  private apiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.apiUrl = environment.apiUrl + 'personas-naturales';
  }

  obtenerPersonasNaturales(): Observable<PersonaNatural[]> {
    return this.http.get<PersonaNatural[]>(`${this.apiUrl}`, { context: checkToken() });
  }

  obtenerPersonaNatural(idPersonaNatural: number): Observable<PersonaNatural> {
    return this.http.get<PersonaNatural>(`${this.apiUrl}/${idPersonaNatural}`, { context: checkToken() });
  }

  crearPersonaNatural(personaNatural: CreatePersonaNaturalDTO): Observable<PersonaNatural> {
    return this.http.post<PersonaNatural>(`${this.apiUrl}`, personaNatural, { context: checkToken() });
  }

  actualizarPersonaNatural(idPersonaNatural: number, personaNatural: CreatePersonaNaturalDTO): Observable<PersonaNatural> {
    return this.http.put<PersonaNatural>(`${this.apiUrl}/${idPersonaNatural}`, personaNatural, { context: checkToken() });
  }

  eliminarPersonaNatural(idPersonaNatural: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idPersonaNatural}`, { context: checkToken() });
  }
}
