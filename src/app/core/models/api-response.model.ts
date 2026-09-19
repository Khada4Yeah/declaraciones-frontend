/**
 * Interfaz genérica para las respuestas estándar del backend.
 * Todas las respuestas de la API siguen esta estructura envolvente.
 */
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message?: string;
  data: T;
}
