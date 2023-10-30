import { Component, OnInit } from '@angular/core';
import { ViewChild } from '@angular/core'
import { ApiService } from 'src/app/services/api.service';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/evento.model';
import { Usuario } from 'src/app/models/usuario.model';

import * as xml2js from 'xml2js';

@Component({
  selector: 'app-estadisticas',
  templateUrl: './estadisticas.component.html',
  styleUrls: ['./estadisticas.component.css']
})
export class EstadisticasComponent implements OnInit {
  public date: any;
  public listaEventos: any[] = [];

  constructor(private api:ApiService) { }

  ngOnInit(): void {
    this.api.getAlleventosua().subscribe(data =>{

        var result:any;
        var parser = require('xml2js');
        parser.Parser().parseString(data, (e:any, r:any) => {result = r});
        this.listaEventos = result['rss'].channel[0].item;

        });
      }


  }


  /*@ViewChild('fromInput', {
    read: MatInput
  }) fromInput: MatInput;

  @ViewChild('toInput', {
    read: MatInput
  }) toInput: MatInput;

  resetForm() {
    this.fromInput.value = '';
    this.toInput.value = '';
  }*/



