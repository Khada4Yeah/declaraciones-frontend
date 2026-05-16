import { Usuario } from "./usuario.model";

/**
 * Interfaz que representa un administrador del sistema.
 * La clave de autenticación está oculta por seguridad ($hidden en el backend).
 */
export interface Administrador {
    id_administrador: number;
    id_usuario: number;
    nombres: string;
    apellido_p: string;
    apellido_m: string;
    usuario: Usuario;
}

/**
 * DTO para crear un nuevo administrador.
 * Incluye la clave ya que es necesaria al momento de la creación.
 */
export type CreateAdministradorDTO = Omit<Administrador, 'id_administrador' | 'usuario'> & {
    correo_electronico: string;
    celular: string;
    clave: string;
};
