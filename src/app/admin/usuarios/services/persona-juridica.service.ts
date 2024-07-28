import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { CreatePersonaJuridicaDTO, PersonaJuridica } from '../models/persona-juridica.model';

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
    return this.http.get<PersonaJuridica[]>(`${this.apiUrl}`);
  }

  obtenerPersonaJuridica(idPersonaJuridica: number): Observable<PersonaJuridica> {
    return this.http.get<PersonaJuridica>(`${this.apiUrl}/${idPersonaJuridica}`);
  }

  crearPersonaJuridica(personaJuridica: CreatePersonaJuridicaDTO): Observable<PersonaJuridica> {
    return this.http.post<PersonaJuridica>(`${this.apiUrl}`, personaJuridica);
  }
}
