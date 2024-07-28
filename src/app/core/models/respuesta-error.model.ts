export interface respuestaError {
    message: string;
    errors: { [key: string]: string[] } | null;
}