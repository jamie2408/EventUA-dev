declare global {
  interface Window { coordenadas: any; }
}
declare global {
  interface Window { pixel: any; }
}
declare global {
  interface Window { selection: any; }
}

import * as THREE from 'three'
import * as MotorTAG from '../motorTAG/index.js';
import { environment  } from '../../environments/environment';
import { Evento } from '../models/evento.model';
import { Lugar } from '../models/lugar.model';
import { EventoService } from '../services/evento.service';
import { LugarService } from '../services/lugar.service';
import { HttpClient } from '@angular/common/http';
import { mat4, glMatrix } from 'gl-matrix';
import { ElementRef, Injectable, NgZone, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EngineService implements OnDestroy {
  private canvas!: HTMLCanvasElement;
  private renderer!: THREE.WebGLRenderer;
  private camara!: MotorTAG.TNodo;
  private luz!: MotorTAG.TNodo;
  private malla!: MotorTAG.TNodo;
  private mallaPin!: MotorTAG.TNodo;
  private mallaNube!: MotorTAG.TNodo;

  private escena!: MotorTAG.TNodo;
  private matIden!: mat4;

  private eventos: Observable<object>;
  public loading = true;
  public listaEventos: Evento[] = [];
  public fini: Date = new Date();
  public ffin: Date = new Date();
  public totaleventos = 0;
  private rotacionpins = 0;

  private frameId!: number;
  private lselected!: any;
  private pointer!: THREE.Vector2;
  private pointerx: number;
  private pointery: number;

  public constructor(private ngZone: NgZone, private http: HttpClient, private eventoService: EventoService,
    private lugarService: LugarService) {
  }

  public ngOnDestroy(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public cargarEventos( desde: number, textoBusqueda?: string, usu?: string, cat?: string, fini?: Date, ffin?: Date, estado?: string, asistidos?: string, like?: string , lugar?:string): Observable<object> {
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
    this.eventos = this.http.get(`${environment.base_url}/eventos/?desde=${desde}&pag=0&texto=${textoBusqueda}&usu=${usu}&cat=${cat}&fini=${fini}&ffin=${ffin}&estado=${estado}&asistidos=${asistidos}&like=${like}&lugar=${lugar}` , this.cabeceras);
    return this.eventos;
  }

  public cargaEventosArray(desde: number, textoBusqueda?: string, usu?: string, cat?: string, fini?: Date, ffin?: Date, estado?: string, asistidos?: string, like?: string, lugar?: string ){
    this.cargarEventos( desde, textoBusqueda, usu, cat, fini, ffin, "APROBADO", asistidos, like, lugar)
    .subscribe( (res:any) => {
      // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
      // Comprobamos si estamos en una página vacia, si es así entonces retrocedemos una página si se puede

      if (res['eventos'].length === 0) {
        if (desde > 0) {
          desde = desde - 0;
          if (desde < 0) { desde = 0};
          this.cargarEventos(0);
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
      this.loading = false;
    });
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    //metodo para dar valor a las variables
    this.canvas = canvas.nativeElement;

    //escena
    var arbol = new MotorTAG.Arbol();
    this.escena= new MotorTAG.TNodo(arbol.raiz);

    //luz
    this.luz = new MotorTAG.TNodo('luz');
    var enLuz = new MotorTAG.ELuz('enLuz', [1.0,1.0,1.0], [0.2,0.2,0.2], [20.0,80.0, 0.0]);
    this.luz.setEntidad(enLuz);
    this.escena.addHijo(this.luz);


    //camara
    this.camara = new MotorTAG.TNodo('camara');
    var enCamara = new MotorTAG.ECamara('enCamara', glMatrix.toRadian(45), this.canvas.clientWidth / this.canvas.clientHeight, 0.1, 1000.0);
    this.camara.setEntidad(enCamara);
    this.escena.addHijo(this.camara);

    //mallas
    this.malla = new MotorTAG.TNodo('malla');
    const gl = this.canvas.getContext('webgl', {preserveDrawingBuffer: true});
    if (!gl) {
      alert('Unable to setup WebGL. Your browser or computer may not support it.');
      return;
    }
    var gr = new MotorTAG.gestorRecursos(gl);
    var texturas = ['textura','suelo','jardin','parking','camino','pintexture','selected'];
    var enMalla = new MotorTAG.EMalla('uaseparado', gr, texturas);
    this.malla.setEntidad(enMalla);
    this.escena.addHijo(this.malla);

    this.mallaPin = new MotorTAG.TNodo('malla');
    var gr2 = new MotorTAG.gestorRecursos(gl);
    var enMallaPin = new MotorTAG.EMalla('pines', gr2);
    this.mallaPin.setEntidad(enMallaPin);
    this.escena.addHijo(this.mallaPin);

    this.mallaNube = new MotorTAG.TNodo('malla');
    var gr3 = new MotorTAG.gestorRecursos(gl);
    var enMallaNube = new MotorTAG.EMalla('nube', gr3);
    this.mallaNube.setEntidad(enMallaNube);
    this.escena.addHijo(this.mallaNube);

    //matriz identidad
    this.matIden=mat4.create();

    //llamamos al metodo de transformaciones enviando por parametro los valores de la escena
    this.transformaciones(this.escena, this.malla, this.mallaPin, this.mallaNube, this.camara, this.luz, this.matIden, gl, this.eventoService, this.lugarService, this.listaEventos, this.rotacionpins);
  }

  public transformaciones(escena: MotorTAG.TNodo, malla: MotorTAG.TNodo, mallaPin: MotorTAG.TNodo, mallaNube: MotorTAG.TNodo, camara: MotorTAG.TNodo, luz: MotorTAG.TNodo, matIden: mat4, gl: WebGLRenderingContext, eventoService: EventoService, lugarService: LugarService, listaEventos: any, rotacionpins:any){
    var selected = 0;
    this.canvas.width = 1500;
    this.canvas.height = 1000;
    var rotacionx = 0;
    var rotaciony = 0;
    var traslacionx = 0;
    var traslaciony = 0;
    var pixel = new window.Uint8Array(4); // A single RGBA value
    var selected_object_id = -1;
    var mouseDown = false,
        mouseX = 0,
        mouseY = 0;

    var scale=1;
    let limiterin = 0;
    let limiterout = 0;
    let limiterrot = 0;

    var rendercanvas = document.getElementById('renderCanvas');

    rendercanvas!.addEventListener('wheel', function (event) {
      event.preventDefault();
      const pointer = new THREE.Vector2();
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
      if (event.deltaY < 0 && limiterin < 7.5) {
        // Zoom in
        scale = 1.25;
        limiterin += scale;

        malla.escalar([scale, scale, scale]);
        malla.trasladar([pointer.y,0,pointer.x]);

        mallaPin.escalar([scale, scale, scale]);
        mallaPin.trasladar([pointer.y,0,pointer.x]);

        mallaNube.escalar([scale, scale, scale]);
        mallaNube.trasladar([pointer.y,0,pointer.x]);
      }
      if (event.deltaY >= 0 && limiterin > 0) {
        // Zoom out
        scale = 0.75;
        limiterin -= 1.60;
        malla.escalar([scale, scale, scale]);
        malla.trasladar([pointer.y,0,pointer.x]);

        mallaPin.escalar([scale, scale, scale]);
        mallaPin.trasladar([pointer.y,0,pointer.x]);

        mallaNube.escalar([scale, scale, scale]);
        mallaNube.trasladar([pointer.y,0,pointer.x]);
      }

    });

    rendercanvas!.addEventListener('mousemove', function (evt) {
      evt.preventDefault();
        var deltaX = evt.clientX - mouseX,
            deltaY = evt.clientY - mouseY;
        mouseX = evt.clientX;
        mouseY = evt.clientY;
        traslaciony += deltaX;
        traslacionx += deltaY;

        if (mouseDown && !evt.ctrlKey){ //traslación sobre el mapa
          malla.trasladar([deltaY/5,0,-deltaX/5]);
          mallaPin.trasladar([deltaY/5,0,-deltaX/5]);
          mallaNube.trasladar([deltaY/5,0,-deltaX/5]);
        }
        if (!mouseDown || !evt.ctrlKey) {return}

        rotaciony += deltaX / 10;
        rotacionx += deltaY / 10;
        malla.rotar((rotaciony), [0, 1, 0]);
        mallaPin.rotar((rotaciony), [0, 1, 0]);

    }, false);

    rendercanvas!.addEventListener('mousedown', function (evt) {

      evt.preventDefault();
      mouseDown = true;
      mouseX = evt.clientX;
      mouseY = evt.clientY;


    }, false);

    rendercanvas!.addEventListener('mouseup', function (evt) {
      evt.preventDefault();
      mouseDown = false;
    }, false);
    rendercanvas!.addEventListener('dblclick', function (evt) {
      //con el doble clic se selecciona la edificio para mostrar sus eventos

      evt.preventDefault();

      var rect = (gl.canvas as any).getBoundingClientRect();

      mouseX = evt.clientX - rect.left;
      mouseY = evt.clientY - rect.top;
      //obtenemos las coordenadas del raton para hacer el colorPick
      window.coordenadas = [mouseX * gl.canvas.width / (gl.canvas as any).clientWidth, gl.canvas.height - mouseY * gl.canvas.height / (gl.canvas as any).clientHeight - 1]

      //limpiamos el buffer de color y profundidad y llamamos al recorrer de escena (dibujado)
      gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
      escena.recorrer(matIden,camara, luz, false, listaEventos, rotacionpins);

      //leemos los pixeles obtenidos del color pick
      if(window.pixel!=undefined){
        //obtenemos el id del edificio en base al color leeido
        var id = window.pixel[0] + 256*window.pixel[1];
        window.selection = id;
        let lugar: Lugar[] = [];

        if (evt.ctrlKey) {return}
          lugarService.obtenerIdLugar(id.toString()).subscribe( (res:any) => {
          lugar = res['lugares'];
          if(lugar[0]){
            eventoService.setLugar(lugar[0].uid!);
          }
          else{
            eventoService.setLugar('');
          }
          eventoService.recarga();
        }, (err) => {
      });
    }
    }, false);
  }

  public animate(): void { //funcion de carga y para llamar al render
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }
    });
  }

  public render(){
    //antes de renderizar limpiamos el buffer de colores y profundidad
    const gl = this.canvas.getContext('webgl', {preserveDrawingBuffer: true});
    gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
    this.rotacionpins += 0.2;
    this.frameId = requestAnimationFrame(() => {
      this.render();
      this.mallaNube.rotar((this.rotacionpins), [0, 1, 0]);
    });

    //llamamos a recorrer de escena para dibujar
    this.escena.recorrer(this.matIden,this.camara, this.luz, true, this.listaEventos, this.rotacionpins);
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
