import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CreatePersonaNaturalDTO, PersonaNatural } from '../models/persona-natural.model';
import { Observable, map } from 'rxjs';
import { checkToken } from '../../../core/interceptors/token.interceptor';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Servicio para gestionar las operaciones CRUD de personas naturales.
 * Se comunica con el endpoint /personas-naturales del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class PersonaNaturalService {
  private apiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.apiUrl = environment.apiUrl + 'personas-naturales';
  }

  /**
   * Obtiene el listado de todas las personas naturales.
   *
   * @returns Observable con el array de personas naturales.
   */
  obtenerPersonasNaturales(): Observable<PersonaNatural[]> {
    return this.http.get<ApiResponse<PersonaNatural[]>>(`${this.apiUrl}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene el detalle de una persona natural por su ID.
   * Incluye la clave de acceso desencriptada.
   *
   * @param idPersonaNatural ID de la persona natural.
   * @returns Observable con los datos de la persona natural.
   */
  obtenerPersonaNatural(idPersonaNatural: number): Observable<PersonaNatural> {
    return this.http.get<ApiResponse<PersonaNatural>>(`${this.apiUrl}/${idPersonaNatural}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Crea una nueva persona natural.
   *
   * @param personaNatural Datos de la persona natural a crear.
   * @returns Observable con la persona natural creada.
   */
  crearPersonaNatural(personaNatural: CreatePersonaNaturalDTO): Observable<PersonaNatural> {
    return this.http.post<ApiResponse<PersonaNatural>>(`${this.apiUrl}`, personaNatural, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza una persona natural existente.
   *
   * @param idPersonaNatural ID de la persona natural a actualizar.
   * @param personaNatural Datos actualizados de la persona natural.
   * @returns Observable con la persona natural actualizada.
   */
  actualizarPersonaNatural(idPersonaNatural: number, personaNatural: CreatePersonaNaturalDTO): Observable<PersonaNatural> {
    return this.http.put<ApiResponse<PersonaNatural>>(`${this.apiUrl}/${idPersonaNatural}`, personaNatural, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Elimina una persona natural.
   *
   * @param idPersonaNatural ID de la persona natural a eliminar.
   * @returns Observable que se completa al eliminar.
   */
  eliminarPersonaNatural(idPersonaNatural: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idPersonaNatural}`, { context: checkToken() });
  }
}
