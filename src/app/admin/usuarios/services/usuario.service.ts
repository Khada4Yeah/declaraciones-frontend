import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable, map } from 'rxjs';
import { Usuario } from '../models/usuario.model';
import { checkToken } from '../../../core/interceptors/token.interceptor';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Servicio para gestionar las operaciones CRUD de usuarios base.
 * Se comunica con el endpoint /usuarios del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.apiUrl = environment.apiUrl + 'usuarios';
  }

  /**
   * Obtiene el listado de todos los usuarios.
   *
   * @returns Observable con el array de usuarios.
   */
  obtenerUsuarios(): Observable<Usuario[]> {
    return this.http.get<ApiResponse<Usuario[]>>(`${this.apiUrl}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene el detalle de un usuario por su ID.
   *
   * @param idUsuario ID del usuario.
   * @returns Observable con los datos del usuario.
   */
  obtenerUsuario(idUsuario: number): Observable<Usuario> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${idUsuario}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Actualiza un usuario existente.
   *
   * @param idUsuario ID del usuario a actualizar.
   * @param usuario Datos actualizados del usuario.
   * @returns Observable con el usuario actualizado.
   */
  actualizarUsuario(idUsuario: number, usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${idUsuario}`, usuario, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Elimina un usuario.
   *
   * @param idUsuario ID del usuario a eliminar.
   * @returns Observable que se completa al eliminar.
   */
  eliminarUsuario(idUsuario: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idUsuario}`, { context: checkToken() });
  }
}
