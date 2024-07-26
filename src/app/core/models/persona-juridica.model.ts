import { Usuario } from "./usuario.model";

export interface PersonaJuridica {
    id_persona_juridica: number;
    id_usuario: number;
    ruc: string;
    razon_social: string;
    clave_acceso: string;
    informacion_adicional: string;
    usuario: Usuario;
}