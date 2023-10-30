import { Usuario } from './usuario.model';

export class Notificacion {
    constructor(
        public receptores: Usuario[],
        public texto: string,
        public uid?: string,
    )
    {}
}
