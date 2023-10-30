import { Injectable } from '@angular/core';
import { environment  } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of, Observable } from 'rxjs';
import { Evento } from '../models/evento.model';
import * as converter from 'xml-js';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  xml: string;
  outputXml: string;
  inputXml: string;
  list: any[];
  url:string = "https://cvnet.cpd.ua.es/AgendaUA/home/Feed?agenda"

  constructor(private http: HttpClient) { }

  getAlleventosua() {
    //return this.http.get<Evento[]>(this.url);
    return this.http.get(this.url, { responseType: 'text' });
  }

}
