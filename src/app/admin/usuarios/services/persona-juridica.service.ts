import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { CreatePersonaJuridicaDTO, PersonaJuridica } from '../models/persona-juridica.model';
import { checkToken } from '../../../core/interceptors/token.interceptor';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Servicio para gestionar las operaciones CRUD de personas jurídicas.
 * Se comunica con el endpoint /personas-juridicas del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class PersonaJuridicaService {
  private apiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.apiUrl = environment.apiUrl + 'personas-juridicas';
  }

  /**
   * Obtiene el listado de todas las personas jurídicas.
   *
   * @returns Observable con el array de personas jurídicas.
   */
  obtenerPersonasJuridicas(): Observable<PersonaJuridica[]> {
    return this.http.get<ApiResponse<PersonaJuridica[]>>(`${this.apiUrl}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene el detalle de una persona jurídica por su ID.
   * Incluye la clave de acceso desencriptada.
   *
   * @param idPersonaJuridica ID de la persona jurídica.
   * @returns Observable con los datos de la persona jurídica.
   */
  obtenerPersonaJuridica(idPersonaJuridica: number): Observable<PersonaJuridica> {
    return this.http.get<ApiResponse<PersonaJuridica>>(`${this.apiUrl}/${idPersonaJuridica}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Crea una nueva persona jurídica.
   *
   * @param personaJuridica Datos de la persona jurídica a crear.
   * @returns Observable con la persona jurídica creada.
   */
  crearPersonaJuridica(personaJuridica: CreatePersonaJuridicaDTO): Observable<PersonaJuridica> {
    return this.http.post<ApiResponse<PersonaJuridica>>(`${this.apiUrl}`, personaJuridica, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza una persona jurídica existente.
   *
   * @param idPersonaJuridica ID de la persona jurídica a actualizar.
   * @param personaJuridica Datos actualizados de la persona jurídica.
   * @returns Observable con la persona jurídica actualizada.
   */
  actualizarPersonaJuridica(idPersonaJuridica: number, personaJuridica: CreatePersonaJuridicaDTO): Observable<PersonaJuridica> {
    return this.http.put<ApiResponse<PersonaJuridica>>(`${this.apiUrl}/${idPersonaJuridica}`, personaJuridica, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Elimina una persona jurídica.
   *
   * @param idPersonaJuridica ID de la persona jurídica a eliminar.
   * @returns Observable que se completa al eliminar.
   */
  eliminarPersonaJuridica(idPersonaJuridica: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idPersonaJuridica}`, { context: checkToken() });
  }
}
