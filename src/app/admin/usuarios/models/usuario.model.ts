export interface Usuario {
    id_usuario: number;
    correo_electronico: string;
    celular: string;
}

export interface CreateUsuarioDTO extends Omit<Usuario, 'id_usuario'> { }