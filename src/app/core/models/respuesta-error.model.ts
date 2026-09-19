/**
 * Interfaz para las respuestas de error del backend.
 * Contiene el mensaje de error y opcionalmente errores de validación por campo.
 */
export interface RespuestaError {
  message: string;
  errors: { [key: string]: string[] } | null;
}