import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LugarService {

  constructor(private http: HttpClient) { }

  actualizarLista(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/lugares/lista/${uid}`, data, this.cabeceras);
  }

  crearLugar(data: any) {
    return this.http.post(`${environment.base_url}/lugares/`, data, this.cabeceras);
  }

  actualizarLugar(uid: string, data: any) {
    return this.http.put(`${environment.base_url}/lugares/${uid}`, data, this.cabeceras);
  }

  obtenerIdLugar(cod: string) {
    if (cod===undefined) { cod=''} else {cod = '00' + cod}
    return this.http.get(`${environment.base_url}/lugares?codigo=${cod}` , this.cabeceras);
  }

  cargarLugar( uid: string) {
    if (uid===undefined) { uid=''}
    return this.http.get(`${environment.base_url}/lugares/?id=${uid}` , this.cabeceras);
  }

  cargarLugares( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/lugares/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}` , this.cabeceras);
  }

  cargarLugaresTodos( desde: number, textoBusqueda?: string, hasta?:string ): Observable<object> {
    if (!desde) { desde = 0; }
    if (!textoBusqueda) { textoBusqueda = ''; }
    if (!hasta) { hasta = '10'; }
    return this.http.get(`${environment.base_url}/lugares/?desde=${desde}&texto=${textoBusqueda}&hasta=${hasta}&pag=0` , this.cabeceras);
  }

  /*listaEventos(desde: number, texto: string, evento: string) {
    if (!texto) {
      texto = '';
    } else {
      texto = `&texto=${texto}`;
    }
    if (!evento) {
      evento = '';
    } else {
      evento = `&evento=${evento}`;
    }
    return this.http.getc(`${environment.base_url}/lugares/?desde=${desde}${texto}${evento}` , this.cabeceras);
  }*/

  eliminarLugar(uid: string) {
    return this.http.delete(`${environment.base_url}/lugares/${uid}`, this.cabeceras);
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
