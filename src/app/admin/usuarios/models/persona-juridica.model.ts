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

export interface CreatePersonaJuridicaDTO extends Omit<PersonaJuridica, 'id_persona_juridica' | 'id_usuario' | 'usuario'> {
    correo_electronico: string;
    celular: string;
}