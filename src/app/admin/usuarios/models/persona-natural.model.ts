import { Usuario } from "./usuario.model";

export interface PersonaNatural {
    id_persona_natural: number;
    id_usuario: number;
    identificacion: string;
    nombres: string;
    apellido_p: string;
    apellido_m: string;
    clave_acceso: string;
    informacion_adicional: string;
    usuario: Usuario;
}

export interface CreatePersonaNaturalDTO extends Omit<PersonaNatural, 'id_persona_natural' | 'id_usuario' | 'usuario'> {
    correo_electronico: string;
    celular: string;
}


