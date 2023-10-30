import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {

  constructor(private http: HttpClient) { }

  crearNotificacion(data: any) {
    return this.http.post(`${environment.base_url}/notificaciones`, data, this.cabeceras);
  }

  actualizarNotificacion(uid: string, data: any) {
    return this.http.put(`${environment.base_url}/notificaciones/${uid}`, data, this.cabeceras);
  }

  cargarNotificacion( uid: string) {
    if (uid===undefined) { uid=''}
    return this.http.get(`${environment.base_url}/notificaciones/?id=${uid}` , this.cabeceras);
  }

  cargarNotificaciones( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/notificaciones/?desde=${desde}&texto=${textoBusqueda}` , this.cabeceras);
  }

  cargarNotificacionesTodas( desde: number, textoBusqueda?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    return this.http.get(`${environment.base_url}/notificaciones/?desde=${desde}&texto=${textoBusqueda}&pag=0` , this.cabeceras);
  }

  listaNotificaciones(desde: number, texto: string, notificacion: string) {
    if (!texto) {
      texto = '';
    } else {
      texto = `&texto=${texto}`;
    }
    if (!notificacion) {
      notificacion = '';
    } else {
      notificacion = `&notificacion=${notificacion}`;
    }
    return this.http.get(`${environment.base_url}/notificaciones/?desde=${desde}${texto}${notificacion}` , this.cabeceras);
  }

  eliminarNotificacion(uid: string) {
    return this.http.delete(`${environment.base_url}/notificaciones/${uid}`, this.cabeceras);
  }

  get cabeceras(): object {
    return {
      headers: {
        'x-token': this.token
      }};
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

}
