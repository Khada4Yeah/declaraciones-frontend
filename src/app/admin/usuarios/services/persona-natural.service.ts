import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CreatePersonaNaturalDTO, PersonaNatural } from '../models/persona-natural.model';
import { Observable } from 'rxjs';

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
    return this.http.get<PersonaNatural[]>(`${this.apiUrl}`);
  }

  obtenerPersonaNatural(idPersonaNatural: number): Observable<PersonaNatural> {
    return this.http.get<PersonaNatural>(`${this.apiUrl}/${idPersonaNatural}`);
  }

  crearPersonaNatural(personaNatural: CreatePersonaNaturalDTO): Observable<PersonaNatural> {
    return this.http.post<PersonaNatural>(`${this.apiUrl}`, personaNatural);
  }
}
