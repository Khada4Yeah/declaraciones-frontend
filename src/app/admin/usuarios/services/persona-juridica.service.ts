import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CreatePersonaJuridicaDTO, PersonaJuridica } from '../models/persona-juridica.model';
import { checkToken } from '../../../core/interceptors/token.interceptor';


@Injectable({
  providedIn: 'root'
})
export class PersonaJuridicaService {
  private apiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.apiUrl = environment.apiUrl + 'personas-juridicas';
  }

  obtenerPersonasJuridicas(): Observable<PersonaJuridica[]> {
    return this.http.get<PersonaJuridica[]>(`${this.apiUrl}`, { context: checkToken() });
  }

  obtenerPersonaJuridica(idPersonaJuridica: number): Observable<PersonaJuridica> {
    return this.http.get<PersonaJuridica>(`${this.apiUrl}/${idPersonaJuridica}`, { context: checkToken() });
  }

  crearPersonaJuridica(personaJuridica: CreatePersonaJuridicaDTO): Observable<PersonaJuridica> {
    return this.http.post<PersonaJuridica>(`${this.apiUrl}`, personaJuridica, { context: checkToken() });
  }

  actualizarPersonaJuridica(idPersonaJuridica: number, personaJuridica: CreatePersonaJuridicaDTO): Observable<PersonaJuridica> {
    console.log('actualizarPersonaJuridica', idPersonaJuridica, personaJuridica, { context: checkToken() });

    return this.http.put<PersonaJuridica>(`${this.apiUrl}/${idPersonaJuridica}`, personaJuridica, { context: checkToken() });
  }

  eliminarPersonaJuridica(idPersonaJuridica: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idPersonaJuridica}`, { context: checkToken() });
  }
}
