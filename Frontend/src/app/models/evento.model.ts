import { Lugar } from './lugar.model';
import { Usuario } from './usuario.model';
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Evento {
    constructor(
        public asistentes: string[],
        public usuario: Usuario,
        public max_aforo: number,
        public precio: number,
        public descripcion: string,
        public valoracion: number,
        public categoria: string,
        public FechaInicioInscripcion: Date,
        public FechaFinInscripcion: Date,
        public link: string,
        public numlikes: number,
        public likes: string[],
        public imagen: string,
        public valoraciones:
        [{
          Key: String,
          Value: Number
        }],
        public nombre?: string,
        public lugar?: Lugar,
        public estado?: string,
        public tipo?: string,
        public areas?: string[],
        public fecha_in?: Date,
        public fecha_fin?: Date,
        public hora?: string,
        public uid?: string,
    )
    {}

    get imagenUrl(): string {
      // Devolvemos la imagen en forma de peticilon a la API
      const token = localStorage.getItem('token') || '';
  
      if (!this.imagen) {
          return 'https://twistedbroadway.com.au/wp-content/uploads/2019/09/Events4.jpg';
      }
      return `${base_url}/upload/foto/${this.imagen}`;
  }
}
