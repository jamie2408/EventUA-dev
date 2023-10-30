import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { Evento } from '../models/evento.model';
import { EventoService } from '../services/evento.service';
import { environment } from '../../environments/environment.prod';
import { UsuarioService } from '../services/usuario.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { ThrowStmt } from '@angular/compiler';
import { ENGINE_METHOD_CIPHERS } from 'constants';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html',
})
export class EngineComponent implements OnInit {
  @ViewChild('rendererCanvas', { static: true })
  public rendererCanvas!: ElementRef<HTMLCanvasElement>;
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  public totaleventos = 0;
  public posicionactual = 0;
  private ultimaBusqueda = '';
  public dinamicURL = '';

  //Cargar eventos

  public usu: any;
  public asis: any;
  public gusta: any;

  public loading = true;
  public listaEventos: Evento[] = [];

  gridColumns = 1;
  isShow = false;

  //Cargar evento

  public eventoSel: any;

  //CHIPS

  public categorias: String[] = ["Mis eventos","Asistidos","Me gusta"];
  public miseventos = false;
  public chipasistidos = false;
  public chipmegusta = false;
  public liked = false;
  public asistido = false;
  public rating = 0;
  public starCount = 5;
  public ratingArr: boolean[] = []; // true = solid star; false = empty star
  public media = '0.0';
  public medianumber = 0;
  public snackBarDuration = 1000;
  public urltweet = '';

  public base64image: any;

  //Area y fecha

  public cat: string= "";

  range = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  public fini: Date = new Date();
  public ffin: Date = new Date();


  //Mostrar feed
  mostrar = false;
  showFiller = false;
  public constructor(private engServ: EngineService,  private eventoService: EventoService,
    private usuarioService: UsuarioService) {}

  public ngOnInit(): void {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();

    //cargamos los eventos
    this.cargarEventos(this.ultimaBusqueda);

    //si se cambia el rango de fechas cargamos eventos
    this.range.valueChanges.subscribe(value => {
      this.cargarEventos(this.ultimaBusqueda);
    });

  }

  cargarEventos( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;

    //comprobamos si los filtros chip estan activos
    if(this.miseventos===true){
      this.usu = this.usuarioService.uid;
    } else {
      this.usu = "";
    }

    if(this.chipasistidos===true){
      this.asis = this.usuarioService.uid;
    } else {
      this.asis = "";
    }

    if(this.chipmegusta===true){
      this.gusta = this.usuarioService.uid;
    } else {
      this.gusta = "";
    }

    this.fini = this.range.value.start;
    this.ffin = this.range.value.end;

    this.eventoService.cargarEventos( this.posicionactual, textoBuscar, this.usu, this.cat, this.fini, this.ffin, "APROBADO", this.asis, this.gusta)
      .subscribe( (res:any) => {
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en una página vacia, si es así entonces retrocedemos una página si se puede

        if (res['eventos'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarEventos(this.ultimaBusqueda);
          } else {
            this.listaEventos = [];
            this.totaleventos = 0;

          }
        } else {
          this.listaEventos = res['eventos'];
          this.totaleventos = res['page'].total;

         // this.cargarEvento(this.listaEventos[0].uid);
        }

        this.loading = false;

        this.fini = new Date();
        this.ffin = new Date();
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });
  }

}
