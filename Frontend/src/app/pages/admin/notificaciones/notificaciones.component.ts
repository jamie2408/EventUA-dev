import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { NotificacionService } from '../../../services/notificacion.service';
import { Notificacion } from '../../../models/notificacion.model';
import { environment } from '../../../../environments/environment.prod';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css']
})
export class NotificacionesComponent implements OnInit {
  public loading = true;

  public totalnotificaciones = 0;
  public posicionactual = 0;

  private ultimaBusqueda = '';
  public listaNotificaciones: Notificacion[] = [];
  // Control de paginación
  public totalregistros: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;

  public buscarForm:any = this.fb.group({
    receptores: ['', Validators.required ],
    texto: ['']
  });
  public subs$:any;

  constructor(private fb: FormBuilder,
    private notificacionService: NotificacionService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
      this.cargarNotificaciones(this.ultimaBusqueda);

      this.subs$ = this.buscarForm.valueChanges
        .subscribe( (event: any) => {
          this.cargarNotificaciones(this.ultimaBusqueda);
        });
  }

  cargarNotificaciones( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.notificacionService.cargarNotificaciones( this.posicionactual, textoBuscar )
      .subscribe( (res:any) => {
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['notificaciones'].length === 0) {
          if (this.posicionactual > 0) {
            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarNotificaciones(this.ultimaBusqueda);
          } else {
            this.listaNotificaciones = [];
            this.totalnotificaciones = 0;
          }
        } else {
          this.listaNotificaciones= res['notificaciones'];
          this.totalnotificaciones = res['page'].total;
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });

  }
  eliminarNotificacion(uid:string, texto:string) {
    // Solo los admin pueden borrar usuarios

    if (this.usuarioService.rol !== 'ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }

    Swal.fire({
      title: 'Eliminar notificacion',
      text: `Al eliminar la notificación '${texto}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.notificacionService.eliminarNotificacion(uid)
              .subscribe( resp => {
                this.cargarNotificaciones(this.ultimaBusqueda);
              }
              ,(err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });
  }

  borrar() {
    this.buscarForm.reset();
    this.cargarNotificaciones(this.ultimaBusqueda);
  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarNotificaciones(this.ultimaBusqueda);
  }

  ngOnDestroy() {
    this.subs$.unsubscribe();
  }
}
