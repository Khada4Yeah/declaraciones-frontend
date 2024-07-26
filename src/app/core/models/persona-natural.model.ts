import { Usuario } from "./usuario.model";

export interface PersonaNatural {
    id_persona_natural: number;
    id_usuario: number;
    nombres: string;
    apellido_p: string;
    apellido_m: string;
    clave_acceso: string;
    informacion_adicional: string;
    usuario: Usuario;
}