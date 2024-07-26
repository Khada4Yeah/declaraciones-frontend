import { Usuario } from "./usuario.model";

export interface Administrador {
    id_administrador: number;
    id_usuario: number;
    nombres: string;
    apellido_p: string;
    apellido_m: string;
    clave: string;
    usuario: Usuario;
}
