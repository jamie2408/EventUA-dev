import { Component, OnInit, OnDestroy} from '@angular/core';
import { LugarService } from '../../../services/lugar.service';
import { Lugar } from '../../../models/lugar.model';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/evento.model';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import { NotificacionService } from '../../../services/notificacion.service';

import * as bootstrap from "bootstrap";
import { Usuario } from 'src/app/models/usuario.model';

declare var $: any;

@Component({
  selector: 'app-eventos',
  templateUrl: './miseventos.component.html',
  styleUrls: ['./miseventos.component.css']
})
export class MiseventosComponent implements OnInit {
  public loading = true;

  public totaleventos = 0;
  public posicionactual = 0;

  private ultimaBusqueda = '';
  public listaEventos: Evento[] = [];
  // Control de paginación
  public totalregistros: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;


  public lugares: Lugar[] = [];

  public buscarForm:any = this.fb.group({
    texto: [''],
    lugar: ['']
  });
  public subs$:any;

  //Control de modal

  public datosForm = this.fb.group({
    receptores: ['', Validators.required ],
    texto: ['']
  });

  public datosForm2 = this.fb.group({
    receptores: ['', Validators.required ],
    texto: ['']
  });

  public submited = false;
  public tituloModal = 'Nueva Notificación';
  public uidmodal = '';
  public uidevento = '';
  public usuarios: any[] = [];

  public fini: Date = new Date("1000-01-01");
  public ffin: Date = new Date("3000-01-01");


  constructor( private fb: FormBuilder,
    private lugarService: LugarService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private notificacionService: NotificacionService) { }

    ngOnInit(): void {
      this.cargarLugares();
      this.cargarEventos(this.ultimaBusqueda);

      this.subs$ = this.buscarForm.valueChanges
        .subscribe( (event: any) => {
          this.cargarEventos(this.ultimaBusqueda);
        });
    }

    cargarEventos( textoBuscar: string ) {
      this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.eventoService.cargarEventos( this.posicionactual, textoBuscar, this.usuarioService.uid, undefined, this.fini, this.ffin )
        .subscribe( (res:any) => {
          // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
          // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
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
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
          this.loading = false;
        });

    }

    eliminarEvento(uid:string, nombre:string, usu: any) {
      // Solo los admin y el creador del evento pueden borrar


      if (this.usuarioService.uid!==usu._id) {
        Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
        return;
      }

      Swal.fire({
        title: 'Eliminar evento',
        text: `Al eliminar el evento '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar'
      }).then((result) => {
            if (result.value) {
              this.eventoService.eliminarEvento(uid)
                .subscribe( resp => {
                  this.cargarEventos(this.ultimaBusqueda);
                }
                ,(err) => {
                  Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                });
            }
        });
    }

    cargarLugares() {
      // cargamos todos los cursos
      this.lugarService.cargarLugares(0, '')
        .subscribe( res => {
          let r:any = res;
          this.lugares= r['lugares'];
        });
    }

    borrar() {
      this.buscarForm.reset();
      this.cargarEventos(this.ultimaBusqueda);
    }

    cambiarPagina( pagina: number) {
      pagina = (pagina < 0 ? 0 : pagina);
      this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
      this.cargarEventos(this.ultimaBusqueda);
    }

    ngOnDestroy() {
      this.subs$.unsubscribe();
    }

    nuevo(uid:any) {
      this.uidmodal = '';
      this.tituloModal = 'Nueva notificación';
      this.datosForm.reset();
      this.datosForm.get('receptores')!.setValue('false');
      this.uidevento = uid;
    }

    cancelar() {
      this.datosForm.reset();
    }

    guardar() {

      this.submited = true;
      if (this.datosForm.invalid) {return; }

      //Cargamos el evento para coger los usuarios
      this.eventoService.cargarEvento(this.uidevento)
        .subscribe( (res:any) => {

          if(this.datosForm.get('receptores')!.value === "true"){
          } else {
            if(res['eventos'].asistentes.length != 0){
              this.datosForm2.get('receptores')!.setValue(res['eventos'].asistentes);
            } else {
              Swal.fire({icon: 'error', title: 'Oops...', text: 'No hay asistentes al evento'});
              return;
            }
          }
          this.datosForm2.get('texto')!.setValue(this.datosForm.get('texto')!.value);

          this.notificacionService.crearNotificacion(this.datosForm2.value)
          .subscribe((res:any) => {
            this.submited = false;
            $('#modalformulario').modal('toggle');
          }, (err) => {
            const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
            Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
          });


        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });


    }

}

