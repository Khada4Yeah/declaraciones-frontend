import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { Administrador } from '../models/administrador.model';
import { checkToken } from '../../../core/interceptors/token.interceptor';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Servicio para gestionar las operaciones CRUD de administradores.
 * Se comunica con el endpoint /administradores del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class AdministradorService {
  private apiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.apiUrl = environment.apiUrl + 'administradores';
  }

  /**
   * Obtiene el listado de todos los administradores.
   *
   * @returns Observable con el array de administradores.
   */
  obtenerAdministradores(): Observable<Administrador[]> {
    return this.http.get<ApiResponse<Administrador[]>>(`${this.apiUrl}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene el detalle de un administrador por su ID.
   *
   * @param idAdministrador ID del administrador.
   * @returns Observable con los datos del administrador.
   */
  obtenerAdministrador(idAdministrador: number): Observable<Administrador> {
    return this.http.get<ApiResponse<Administrador>>(`${this.apiUrl}/${idAdministrador}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Crea un nuevo administrador.
   *
   * @param administrador Datos del administrador a crear.
   * @returns Observable con el administrador creado.
   */
  crearAdministrador(administrador: Omit<Administrador, 'id_administrador' | 'usuario'>): Observable<Administrador> {
    return this.http.post<ApiResponse<Administrador>>(`${this.apiUrl}`, administrador, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza un administrador existente.
   *
   * @param idAdministrador ID del administrador a actualizar.
   * @param administrador Datos actualizados del administrador.
   * @returns Observable con el administrador actualizado.
   */
  actualizarAdministrador(idAdministrador: number, administrador: Partial<Administrador>): Observable<Administrador> {
    return this.http.put<ApiResponse<Administrador>>(`${this.apiUrl}/${idAdministrador}`, administrador, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Elimina un administrador.
   *
   * @param idAdministrador ID del administrador a eliminar.
   * @returns Observable que se completa al eliminar.
   */
  eliminarAdministrador(idAdministrador: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idAdministrador}`, { context: checkToken() });
  }
}
