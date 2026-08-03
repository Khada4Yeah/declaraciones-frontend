import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Archivo } from '../models/archivo.model';
import { Observable, map } from 'rxjs';
import { checkToken } from '../../../core/interceptors/token.interceptor';
import { ApiResponse } from '../../../core/models/api-response.model';

/**
 * Servicio para gestionar las operaciones de archivos por usuario.
 * Se comunica con los endpoints /archivos del backend.
 */
@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  private apiUrl: string;
  private http = inject(HttpClient);

  constructor() {
    this.apiUrl = environment.apiUrl + 'archivos';
  }

  /**
   * Obtiene los archivos de un usuario filtrados por año.
   *
   * @param idUsuario ID del usuario.
   * @param year Año/carpeta a consultar.
   * @returns Observable con el array de archivos.
   */
  obtenerArchivosPorAnio(idUsuario: number, year: number): Observable<Archivo[]> {
    return this.http.get<ApiResponse<Archivo[]>>(`${this.apiUrl}/${idUsuario}?year=${year}`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Obtiene los años disponibles que tienen archivos para un usuario.
   *
   * @param idUsuario ID del usuario.
   * @returns Observable con el array de años.
   */
  obtenerAniosDisponibles(idUsuario: number): Observable<number[]> {
    return this.http.get<ApiResponse<number[]>>(`${this.apiUrl}/${idUsuario}/years`, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Sube uno o múltiples archivos para un usuario en un año específico.
   * Utiliza FormData para enviar los archivos como multipart/form-data.
   *
   * @param idUsuario ID del usuario.
   * @param year Año/carpeta destino.
   * @param files Array de archivos a subir.
   * @returns Observable con los archivos creados.
   */
  subirArchivos(idUsuario: number, year: number, files: File[]): Observable<Archivo[]> {
    const formData = new FormData();
    formData.append('id_usuario', idUsuario.toString());
    formData.append('year', year.toString());
    files.forEach(file => formData.append('files[]', file, file.name));

    return this.http.post<ApiResponse<Archivo[]>>(`${this.apiUrl}`, formData, { context: checkToken() }).pipe(
      map(response => response.data)
    );
  }

  /**
   * Descarga un archivo individual como blob.
   *
   * @param idArchivo ID del archivo a descargar.
   * @returns Observable con el Blob del archivo.
   */
  descargarArchivo(idArchivo: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/download/${idArchivo}`, {
      context: checkToken(),
      responseType: 'blob'
    });
  }

  /**
   * Descarga múltiples archivos empaquetados en un ZIP.
   *
   * @param idsArchivos Array de IDs de archivos a incluir en el ZIP.
   * @returns Observable con el Blob del ZIP.
   */
  descargarZip(idsArchivos: number[]): Observable<Blob> {
    return this.http.post(`${this.apiUrl}/download-zip`, { ids: idsArchivos }, {
      context: checkToken(),
      responseType: 'blob'
    });
  }

  /**
   * Elimina un archivo (soft delete en el backend).
   *
   * @param idArchivo ID del archivo a eliminar.
   * @returns Observable que se completa al eliminar.
   */
  eliminarArchivo(idArchivo: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${idArchivo}`, { context: checkToken() });
  }
}
