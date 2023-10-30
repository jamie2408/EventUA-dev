import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { number, string } from 'mathjs';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  public lselected!: string;
  private desde!: number;
  private textoBusqueda!:string;
  private usu!:string;
  private cat!:string;
  private estado!:string;
  private fini!: Date;
  private ffin!: Date;
  private asistidos!:string;
  private like!:string;

  constructor(private http: HttpClient) { }


  actualizarLista(uid:string, plista: string[]) {
    const data = {lista: plista};
    return this.http.put(`${environment.base_url}/eventos/lista/${uid}`, data, this.cabeceras);
  }

  crearEvento(data: any) {
    return this.http.post(`${environment.base_url}/eventos/`, data, this.cabeceras);
  }

  subirFoto( uid: string, foto: File) {
    const url = `${environment.base_url}/upload/foto/evento/${uid}`;
    const datos: FormData = new FormData();
    datos.append('archivo', foto, foto.name);
    return this.http.post(`${environment.base_url}/upload/foto/evento/${uid}`, datos, this.cabeceras);
  }

  actualizarEvento(uid: string, data: any) {
    return this.http.put(`${environment.base_url}/eventos/${uid}`, data, this.cabeceras);
  }

  cargarEvento( uid: string) {
    if (uid===undefined) { uid=''}
    return this.http.get(`${environment.base_url}/eventos/?id=${uid}` , this.cabeceras);
  }

  getLugarSelected(){
    return this.lselected;
  }

  setLugar(id:string){
    this.lselected = id;
  }

  recarga(){

  }

  cargarEventos( desde: number, textoBusqueda?: string, usu?: string, cat?: string, fini?: Date, ffin?: Date, estado?: string, asistidos?: string, like?: string, lugar?:string): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if (!usu) {usu = ''};
    if (!cat) {cat = ''};
    if (!estado) {estado = ''};
    if (!lugar) {lugar = ''} else { this.lselected = lugar}
    if (fini){
      if(!ffin){
        ffin = fini;
      }
    } else {
      fini = new Date("1000-01-01");
      if(!ffin){
        ffin = new Date("3000-01-01");
      }
    }
    if (!asistidos) {asistidos = ''};
    if (!like) {like = ''};

    return this.http.get(`${environment.base_url}/eventos/?desde=${desde}&pag=1&texto=${textoBusqueda}&usu=${usu}&cat=${cat}&fini=${fini}&ffin=${ffin}&estado=${estado}&asistidos=${asistidos}&like=${like}&lugar=${lugar}` , this.cabeceras);
  }

  cargarEventosTodos( desde: number, textoBusqueda?: string , usu?: string, cat?: string, fini?: Date, ffin?: Date, estado?: string, asistidos?: string, like?: string ): Observable<object> {
    if (!desde) { desde = 0;}
    if (!textoBusqueda) {textoBusqueda = '';}
    if (!usu) {usu = '';}
    if (!cat) {cat = '';}
    if (!estado) {estado = ''};
    if (fini){
      if(!ffin){
        ffin = fini;
      }
    } else {
      fini = new Date("1000-01-01");
      if(!ffin){
        ffin = new Date("3000-01-01");
      }
    }
    if (!asistidos) {asistidos = ''};
    if (!like) {like = ''};
    return this.http.get(`${environment.base_url}/eventos/?desde=${desde}&pag=0&texto=${textoBusqueda}&usu=${usu}&cat=${cat}&fini=${fini}&ffin=${ffin}&estado=${estado}&asistidos=${asistidos}&like=${like}` , this.cabeceras);
  }

  listaLugares(desde: number, texto: string, lugar: string) {
    if (!texto) {
      texto = '';
    } else {
      texto = `&texto=${texto}`;
    }
    if (!lugar) {
      lugar = '';
    } else {
      lugar = `&lugar=${lugar}`;
    }
    return this.http.get(`${environment.base_url}/eventos/?desde=${desde}${texto}${lugar}` , this.cabeceras);
  }

  eliminarEvento(uid: string) {
    return this.http.delete(`${environment.base_url}/eventos/${uid}`, this.cabeceras);
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
