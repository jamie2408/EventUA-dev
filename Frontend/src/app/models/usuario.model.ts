
import { environment } from '../../environments/environment';
import { Evento } from './evento.model';

const base_url: string = environment.base_url;

export class Usuario {

    constructor(
                 public uid: string,
                 public rol: string,
                 public email?: string,
                 public nombre?: string,
                 public apellido?: string,
                 public edad?: number,
                 public activo?: boolean,
                 public baneado?: boolean,
                 public imagen?: string,
                 public asistidos?: string[],
                 public favoritos?: string[],
               //  public notificaciones?: Notificacion[],

               ) {}

    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/foto/usuario/no-imagen?token=${token}`;
        }
        return `${base_url}/upload/foto/usuario/${this.imagen}?token=${token}`;
    }


}
