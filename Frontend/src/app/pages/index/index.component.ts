import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { EventoService } from '../../services/evento.service';
import { Evento } from '../../models/evento.model';
import { environment } from '../../../environments/environment.prod';
import { UsuarioService } from '../../services/usuario.service';
import { EngineService } from '../../engine/engine.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChip, MatChipList } from '@angular/material/chips';
import { RatingModule } from "ngx-rating";
import { MatDialog } from '@angular/material/dialog';
import { DialogContentInfoComponent } from '../../commons/dialog-content-info/dialog-content-info.component';

import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
const htmlToPdfmake = require("html-to-pdfmake");
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;



import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';
import { ThrowStmt } from '@angular/compiler';
import { ENGINE_METHOD_CIPHERS } from 'constants';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

declare var require: any;




@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit  {

  // Control de paginación
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


  constructor(private fb: FormBuilder,
    private eventoService: EventoService,
    private engineService: EngineService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private ususuarioService: UsuarioService,
    private http: HttpClient) { this.ratingArr = Array(this.starCount).fill(false); }

  ngOnInit(): void {

    //cargamos los eventos
    this.cargarEventos(this.ultimaBusqueda);

    //si se cambia el rango de fechas cargamos eventos
    this.range.valueChanges.subscribe(value => {
      this.cargarEventos(this.ultimaBusqueda);
    });

    //si se cambia el lugar cargamos eventos

    //si el enlace viene con evento lo cargamos
    this.route.paramMap.subscribe(params => {
      this.cargarEvento(params.get('id'));
  });

  }

  //devuelve el tipo de estrella de la media
  returnStarMedia(i: number) {
    if(this.medianumber >= i + 1){
        return 'star';
      } else {
        return 'star_border';
      }
  }

  //cargamos los eventos con el lugar, añadimos el setTimeOut para que de tiempo a cargar el lugar
  actualizaLugar(){
    setTimeout(()=>
    {
      this.cargarEventos(this.ultimaBusqueda);
      this.mostrar = true;
    }, 500);
  }

  //devuelve el tipo de estrella
  returnStar(i: number) {
    let actual = 0;
    if(this.eventoSel.valoraciones!=undefined){
    this.eventoSel.valoraciones.forEach((element:any, index:any)  => {
      if(this.usuarioService.uid == element.Key){
        actual = element.Value;
      }
    });
    }

    if(this.rating == 0){
      if (actual >= i + 1) {
        return 'star';
      } else {
        return 'star_border';
      }
    }
    else{
    if (this.rating >= i + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }
  }

  onClick(i: number, eventoSel:Evento) { //añade valoración
    this.rating = i + 1;
    let nuevo = true;
    eventoSel.valoraciones.forEach((element:any, index:any)  => {
      if(this.usuarioService.uid == element.Key){
        element.Value = this.rating;
        nuevo = false;
      }
    });
    if(nuevo){
    eventoSel.valoraciones.push( {
      Key: this.usuarioService.uid!,
      Value: this.rating
    })
    }

    let dataev = {
      nombre: eventoSel.nombre,
      lugar: eventoSel.lugar,
      max_aforo: eventoSel.max_aforo,
      estado: eventoSel.estado,
      descripcion: eventoSel.descripcion,
      tipo: eventoSel.tipo,
      precio: eventoSel.precio,
      areas: eventoSel.areas,
      categoria: eventoSel.categoria,
      fecha_in: eventoSel.fecha_in,
      fecha_fin: eventoSel.fecha_fin,
      hora: eventoSel.hora,
      valoraciones: eventoSel.valoraciones,
      numlikes: eventoSel.numlikes,
      imagen: eventoSel.imagen,
      usuario: eventoSel.usuario,
      link: eventoSel.link,
      asistentes: eventoSel.asistentes,
      likes: eventoSel.likes
    };
    this.calculaValoracion(eventoSel);
    this.eventoService.actualizarEvento(eventoSel.uid!, dataev).subscribe();
  }

  //calculamos la valoracion
  calculaValoracion(eventoSel:Evento){
    let suma = 0;
    let cont = 0;
    let med = "0.0";
    eventoSel.valoraciones!.forEach( (element:any) => { //lo borramos del usuario
      suma = suma + element.Value;
      cont++;
    });
    this.media = (suma/cont).toFixed(1);
    this.medianumber = suma/cont;

    if(this.media == 'NaN'){
      this.media = '0.0';
    }
  }

  //cargamos los eventos
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
    let lug = this.eventoService.getLugarSelected();

    this.eventoService.cargarEventos( this.posicionactual, textoBuscar, this.usu, this.cat, this.fini, this.ffin, "APROBADO", this.asis, this.gusta, lug)
      .subscribe( (res:any) => {
        this.engineService.cargaEventosArray( this.posicionactual, textoBuscar, this.usu, this.cat, this.fini, this.ffin, "APROBADO", this.asis, this.gusta);

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

  formatoURL(url: string){
    let split = url.split(':')
    let URL = url;
    if(split[0] != 'https' && split[0] != 'http'){
    URL = 'https://eventua.ovh/api/upload/foto/evento/' + url;
    }
    return URL
  }

  //abrimos el modal de crear evento
  openDialogCrearEvento() {
    const dialogRef = this.dialog.open(DialogContentInfoComponent);
  }

  //comprobamos si asistia al evento
  compruebaAsistente(eventoSel:Evento){
    let found = false;
    let arrayasis = this.usuarioService.asistidos;


    arrayasis!.forEach( (element:any) => {

      if(element == eventoSel.uid){
        found = true;
      }
    });

    if(found){
      this.asistido = true;
    }
    else{
      this.asistido = false;
    }
  }

  //añadimos asistencia al evento
  addAsistente(eventoSel:Evento){
    this.asistido = !this.asistido;
    let arrayasis: string [] = [];

    if(this.usuarioService.asistidos == undefined){

    this.usuarioService.establecerArray(arrayasis);

    if(this.asistido == false){  //borramos el evento del array de favs

      this.usuarioService.asistidos!.forEach( (element:any, index:any) => { //lo borramos del usuario
          if(element == eventoSel.uid){
            eventoSel.asistentes!.splice(index,1);
            this.usuarioService.asistidos!.splice(index,1);
          }
         });
      eventoSel.asistentes!.forEach( (element:any, index:any) => { //lo borramos del evento
          if(element == this.usuarioService.uid){
            eventoSel.asistentes!.splice(index,1);
          }
         });
      }
      else{ // lo insertamos
        this.usuarioService.establecerasistentes(eventoSel.uid!);
        eventoSel.asistentes.push(this.usuarioService.uid);
      }

      let data = {
        nombre: this.usuarioService.nombre,
        apellido: this.usuarioService.apellido,
        asistidos: this.usuarioService.asistidos,
        favoritos: this.usuarioService.favoritos,
        edad: this.usuarioService.edad,
        baneado: this.usuarioService.baneado,
        imagenUrl: this.usuarioService.imagenURL,
        activo: this.usuarioService.activo,
        uid: this.usuarioService.uid,
        rol: this.usuarioService.rol,
        email: this.usuarioService.email,

      };
      let dataev = {
        nombre: eventoSel.nombre,
        lugar: eventoSel.lugar,
        max_aforo: eventoSel.max_aforo,
        estado: eventoSel.estado,
        descripcion: eventoSel.descripcion,
        tipo: eventoSel.tipo,
        precio: eventoSel.precio,
        areas: eventoSel.areas,
        categoria: eventoSel.categoria,
        fecha_in: eventoSel.fecha_in,
        fecha_fin: eventoSel.fecha_fin,
        hora: eventoSel.hora,
        valoracion: eventoSel.valoracion,
        numlikes: eventoSel.numlikes,
        imagen: eventoSel.imagen,
        usuario: eventoSel.usuario,
        likes: eventoSel.likes,
        link: eventoSel.link,
        asistentes: eventoSel.asistentes
      };

      this.eventoService.actualizarEvento(eventoSel.uid!, dataev).subscribe();
      this.usuarioService.actualizarUsuario(this.usuarioService.uid, data).subscribe();

    }

    else{

      if(this.asistido == false){  //borramos el evento del array de favs
        this.usuarioService.asistidos!.forEach( (element:any, index:any) => { //lo borramos del usuario
          if(element == eventoSel.uid){
            this.usuarioService.asistidos!.splice(index,1);
          }
         });
         eventoSel.asistentes!.forEach( (element:any, index:any) => { //lo borramos del evento
          if(element == this.usuarioService.uid){
            eventoSel.asistentes!.splice(index,1);
          }
         });
      }
      else{ // lo insertamos
        this.usuarioService.establecerasistentes(eventoSel.uid!);
        eventoSel.asistentes.push(this.usuarioService.uid);
      }

      let data = {
        nombre: this.usuarioService.nombre,
        apellido: this.usuarioService.apellido,
        asistidos: this.usuarioService.asistidos,
        favoritos: this.usuarioService.favoritos,
        edad: this.usuarioService.edad,
        baneado: this.usuarioService.baneado,
        imagenUrl: this.usuarioService.imagenURL,
        activo: this.usuarioService.activo,
        uid: this.usuarioService.uid,
        rol: this.usuarioService.rol,
        email: this.usuarioService.email,

      };
      let dataev = {
        nombre: eventoSel.nombre,
        lugar: eventoSel.lugar,
        max_aforo: eventoSel.max_aforo,
        estado: eventoSel.estado,
        descripcion: eventoSel.descripcion,
        tipo: eventoSel.tipo,
        precio: eventoSel.precio,
        areas: eventoSel.areas,
        categoria: eventoSel.categoria,
        fecha_in: eventoSel.fecha_in,
        fecha_fin: eventoSel.fecha_fin,
        hora: eventoSel.hora,
        valoracion: eventoSel.valoracion,
        numlikes: eventoSel.numlikes,
        imagen: eventoSel.imagen,
        usuario: eventoSel.usuario,
        link: eventoSel.link,
        asistentes: eventoSel.asistentes,
        likes: eventoSel.likes
      };
      this.eventoService.actualizarEvento(eventoSel.uid!, dataev).subscribe();
      this.usuarioService.actualizarUsuario(this.usuarioService.uid, data).subscribe();

    }
  }

  //cambiamos el valor del chip seleccionado
  toggleSelection(chip: any) {

    //si se seleccion un chip cambiamos su valor y cargamos eventos
    if(chip._value === "Mis eventos"){
      if(this.miseventos === true){
        this.miseventos = false;
      } else {
        this.miseventos = true;
      }
    }

    if(chip._value === "Asistidos"){
      if(this.chipasistidos === true){
        this.chipasistidos = false;
      } else {
        this.chipasistidos = true;
      }
    }

    if(chip._value === "Me gusta"){
      if(this.chipmegusta === true){
        this.chipmegusta = false;
      } else {
        this.chipmegusta = true;
      }
    }

    chip.toggleSelected();

    this.cargarEventos(this.ultimaBusqueda);
  }

  //creamos url del tuit
  creaurlTweet(eventoSel:Evento){
    this.urltweet = 'https://twitter.com/intent/tweet?text=Visita%20el%20evento%20'+ eventoSel.nombre +'%20desde%20%282012%29%20by%20Ada%20on%20%40letterboxd%3A%20https%3A%2F%2Feventua.ovh%2F2FvAF7'
  }

  //comprobamos si hay like anterior
  compruebaLike(eventoSel:Evento){

    let found = false;
    let arrayfavs = this.usuarioService.favoritos;


    arrayfavs!.forEach( (element:any) => {

      if(element == eventoSel.uid){
        found = true;
      }
    });

    if(found){
      this.liked = true;
    }
    else{
      this.liked = false;
    }
  }

  //añadimos el like
  addLike(eventoSel:Evento){
    this.liked = !this.liked;
    let arrayfavs: string [] = [];

    if(this.usuarioService.favoritos == undefined){

    this.usuarioService.establecerArray(arrayfavs);

    if(this.liked == false){  //borramos el evento del array de favs

        this.usuarioService.favoritos!.forEach( (element:any, index:any) => {
          if(element == eventoSel.uid){
            this.usuarioService.favoritos!.splice(index,1);
            eventoSel.numlikes = eventoSel.numlikes - 1;
          }
         });
      }
      else{ // lo insertamos
        this.usuarioService.establecerfavoritos(eventoSel.uid!);
        eventoSel.numlikes = eventoSel.numlikes + 1;
        eventoSel.likes.push(this.usuarioService.uid)
      }

      let data = {
        nombre: this.usuarioService.nombre,
        apellido: this.usuarioService.apellido,
        asistidos: this.usuarioService.asistidos,
        favoritos: this.usuarioService.favoritos,
        edad: this.usuarioService.edad,
        baneado: this.usuarioService.baneado,
        imagenUrl: this.usuarioService.imagenURL,
        activo: this.usuarioService.activo,
        uid: this.usuarioService.uid,
        rol: this.usuarioService.rol,
        email: this.usuarioService.email,

      };
      let dataev = {
        nombre: eventoSel.nombre,
        lugar: eventoSel.lugar,
        max_aforo: eventoSel.max_aforo,
        estado: eventoSel.estado,
        descripcion: eventoSel.descripcion,
        tipo: eventoSel.tipo,
        precio: eventoSel.precio,
        areas: eventoSel.areas,
        categoria: eventoSel.categoria,
        fecha_in: eventoSel.fecha_in,
        fecha_fin: eventoSel.fecha_fin,
        hora: eventoSel.hora,
        valoracion: eventoSel.valoracion,
        numlikes: eventoSel.numlikes,
        imagen: eventoSel.imagen,
        usuario: eventoSel.usuario,
        link: eventoSel.link,
        likes: eventoSel.likes,
        asistentes: eventoSel.asistentes
      };

      this.eventoService.actualizarEvento(eventoSel.uid!, dataev).subscribe();
      this.usuarioService.actualizarUsuario(this.usuarioService.uid, data).subscribe();


    }

    else{

      if(this.liked == false){  //borramos el evento del array de favs
        this.usuarioService.favoritos!.forEach( (element:any, index:any) => {

          if(element == eventoSel.uid){
            this.usuarioService.favoritos!.splice(index,1);
            eventoSel.numlikes = eventoSel.numlikes - 1;
          }
         });
      }
      else{ // lo insertamos
        this.usuarioService.establecerfavoritos(eventoSel.uid!);
        eventoSel.numlikes = eventoSel.numlikes + 1;
        eventoSel.likes.push(this.usuarioService.uid)
      }


      let data = {
        nombre: this.usuarioService.nombre,
        apellido: this.usuarioService.apellido,
        asistidos: this.usuarioService.asistidos,
        favoritos: this.usuarioService.favoritos,
        edad: this.usuarioService.edad,
        baneado: this.usuarioService.baneado,
        imagenUrl: this.usuarioService.imagenURL,
        activo: this.usuarioService.activo,
        uid: this.usuarioService.uid,
        rol: this.usuarioService.rol,
        email: this.usuarioService.email,

      };
      let dataev = {
        nombre: eventoSel.nombre,
        lugar: eventoSel.lugar,
        max_aforo: eventoSel.max_aforo,
        estado: eventoSel.estado,
        descripcion: eventoSel.descripcion,
        tipo: eventoSel.tipo,
        precio: eventoSel.precio,
        areas: eventoSel.areas,
        categoria: eventoSel.categoria,
        fecha_in: eventoSel.fecha_in,
        fecha_fin: eventoSel.fecha_fin,
        hora: eventoSel.hora,
        valoracion: eventoSel.valoracion,
        numlikes: eventoSel.numlikes,
        imagen: eventoSel.imagen,
        usuario: eventoSel.usuario,
        link: eventoSel.link,
        likes: eventoSel.likes,
        asistentes: eventoSel.asistentes
      };

      this.eventoService.actualizarEvento(eventoSel.uid!, dataev).subscribe();
      this.usuarioService.actualizarUsuario(this.usuarioService.uid, data).subscribe();

    }

  }

  //mostramos el feed de los eventos
  mostrarFeed(){
    this.mostrar = true;
  }

  //cargamos un evento
  cargarEvento(uid: any){
    this.eventoService.cargarEvento(uid)
        .subscribe( res => {
          let response :any = res;
          this.eventoSel = res;

          this.eventoSel = this.eventoSel.eventos;
          if(response.ok!=false) {
            //arreglamos el link si viene sin http
            if(this.eventoSel.link.substr(0,4) === "http"){
              this.dinamicURL = this.eventoSel.link;
            } else {
              this.dinamicURL = "//" + this.eventoSel.link;
            }

            //ajustamos el tamaño del texto
            if(this.eventoSel.nombre.length > 70)
            this.eventoSel.nombre = this.eventoSel.nombre.substr(0, 70)+"...";

            //eleminamos las horas de las fechas
            if(this.eventoSel.fecha_in) this.eventoSel.fecha_in = this.eventoSel.fecha_in.split("T", 3);
            if(this.eventoSel.fecha_fin) this.eventoSel.fecha_fin = this.eventoSel.fecha_fin.split("T", 3);
            if(this.eventoSel.FechaInicioInscripcion) this.eventoSel.FechaInicioInscripcion = this.eventoSel.FechaInicioInscripcion.split("T", 3);
            if(this.eventoSel.FechaFinInscripcion) this.eventoSel.FechaFinInscripcion = this.eventoSel.FechaFinInscripcion.split("T", 3);

            //comprobamos likes y valoraciones
            this.compruebaLike(this.eventoSel);
            this.compruebaAsistente(this.eventoSel);
            this.calculaValoracion(this.eventoSel);
            this.creaurlTweet(this.eventoSel);
        }
        }, (err) => {
          this.router.navigateByUrl('/home');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
  }

  //cerramos un evento
  cerrarEvento(){
    this.eventoSel = undefined;
  }

  //cerramos un evento y el feed de eventos
  cerrarTodo(){
    //escondemos la tabla de eventos y el evento abierto con la animacion
    if (this.mostrar === true) document.getElementById("col-feed")!.classList.add("col-feed-hide");
    if(this.eventoSel) document.getElementById("col-evento")!.classList.add("col-evento-hide");
    //añadimos un temporizador para que la animacion se ejecute antes de cerrarlo
    setTimeout(()=>
    {
      this.eventoSel = undefined;
      this.mostrar = false;
    }, 500);
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarEventos(this.ultimaBusqueda);
    var elem = document.getElementById('content');
    elem!.scrollTo(0,0);
  }


  //descargamos pdf con la info del evento
  @ViewChild('pdfTable')
  pdfTable!: ElementRef;

  downloadAsPDF() {
    var image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAfQAAAH0CAYAAADL1t+KAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAOxAAADsQBlSsOGwAABGhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0nYWRvYmU6bnM6bWV0YS8nPgo8cmRmOlJERiB4bWxuczpyZGY9J2h0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMnPgoKIDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PScnCiAgeG1sbnM6QXR0cmliPSdodHRwOi8vbnMuYXR0cmlidXRpb24uY29tL2Fkcy8xLjAvJz4KICA8QXR0cmliOkFkcz4KICAgPHJkZjpTZXE+CiAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9J1Jlc291cmNlJz4KICAgICA8QXR0cmliOkNyZWF0ZWQ+MjAyMi0wMi0yMjwvQXR0cmliOkNyZWF0ZWQ+CiAgICAgPEF0dHJpYjpFeHRJZD40ODk5NDdiNi1kMTcyLTQ2MjQtOGJiMS1iMGZlYzAwYWNjOTY8L0F0dHJpYjpFeHRJZD4KICAgICA8QXR0cmliOkZiSWQ+NTI1MjY1OTE0MTc5NTgwPC9BdHRyaWI6RmJJZD4KICAgICA8QXR0cmliOlRvdWNoVHlwZT4yPC9BdHRyaWI6VG91Y2hUeXBlPgogICAgPC9yZGY6bGk+CiAgIDwvcmRmOlNlcT4KICA8L0F0dHJpYjpBZHM+CiA8L3JkZjpEZXNjcmlwdGlvbj4KCiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0nJwogIHhtbG5zOmRjPSdodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyc+CiAgPGRjOnRpdGxlPgogICA8cmRmOkFsdD4KICAgIDxyZGY6bGkgeG1sOmxhbmc9J3gtZGVmYXVsdCc+QU1PUiBSRUFMPC9yZGY6bGk+CiAgIDwvcmRmOkFsdD4KICA8L2RjOnRpdGxlPgogPC9yZGY6RGVzY3JpcHRpb24+CgogPHJkZjpEZXNjcmlw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zS61GEJiehqJ6WkkZ2eMbk6aKEEJVEGpqYW1sYlLz6hgGOiUk5SmY3IxjrFgDFNLCRap2QaHLMJjk+C2SvDYJHis6cc7dDJ62dNVFcn5OajhMNRIFGokvPw4DGjFW74pKAokrw+SzwclUA25qqpo56LKxkCnvKU0Hc8X45hcjGMqnECca9pfIAsC3FYRDkWEQxbhUAQ4ZAl2WYC7RPXSKTtaLAY1EkkHfDT9fy0Wg5ZKQVdTQEqFpqqA+mr5ZIsswyLLECQZgs0K0e6E4HRAdDghe9wQbHYDviOqRAx0KphQLIWpcAIz4QTmIkkkVPMHvGCxwC6LcMoC3DYJLkWE2yrBZZVgK9JuZURE62GgU9FEkhrmIwksRFOYjSSxEEvuyCF6pyLBbRXhVtK9a/tyj9suCVAY2kRUJhjoVFIL0RTmogksxVXEkhqiKRXRpGpICVpFECBLAhTRAkUUYBUtkCUBNkmE2yrCpYgl20qUiGi7GOhUNqJJDbGkimgqHfbxbQ7ZWwBIogBFXA1tRVr+P2eNE5HJMNCJiIhMgN0UIiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjIBBjoREZEJMNCJiIhMgIFORERkAgx0IiIiE2CgExERmQADnYiIyAQY6ERERCbAQCciIjKB/w9JHLibuGWfawAAAABJRU5ErkJggg==';
    const pdfTable = this.pdfTable.nativeElement;
    var html = htmlToPdfmake(pdfTable.innerHTML);
    const documentDefinition = {
      content: [
        {

            image : image,
            width: 200,
            absolutePosition: { x: 200, y: 20 }


        },{
          text: html,
          absolutePosition: { x: 20, y: 200 }
        }

    ]};
    pdfMake.createPdf(documentDefinition).download(this.eventoSel.nombre);

  }



}


