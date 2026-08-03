/**
 * Interfaz que representa un archivo almacenado en el sistema.
 * Corresponde a un registro de la tabla 'archivos' del backend.
 */
export interface Archivo {
  id_archivo: number;
  id_usuario: number;
  file_name: string;
  file_path: string;
  file_size: number;
  file_extension: string;
  mime_type: string;
  year: number;
  created_at: string;
}
