import { Component, OnInit } from '@angular/core';
import { LugarService } from '../../../services/lugar.service';
import { Lugar } from '../../../models/lugar.model';
import { FormBuilder } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/evento.model';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lugares',
  templateUrl: './lugares.component.html',
  styleUrls: ['./lugares.component.css']
})
export class LugaresComponent implements OnInit {
  public loading = true;

  public totallugares = 0;
  public posicionactual = 0;

  private ultimaBusqueda = '';
  public listaLugares: Lugar[] = [];
  // Control de paginación
  public totalregistros: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;


  public eventos: Evento[] = [];

  public buscarForm:any = this.fb.group({
    texto: [''],
    lugar: ['']
  });
  public subs$:any;

  constructor( private fb: FormBuilder,
    private lugarService: LugarService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService) { }

    ngOnInit(): void {
      this.cargarEventos();
      this.cargarLugares(this.ultimaBusqueda);

      this.subs$ = this.buscarForm.valueChanges
        .subscribe( (event: any) => {
          this.cargarLugares(this.ultimaBusqueda);
        });
    }

    cargarLugares( textoBuscar: string ) {
      this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.lugarService.cargarLugares( this.posicionactual, textoBuscar )
        .subscribe( (res:any) => {
          // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
          // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
          if (res['lugares'].length === 0) {
            if (this.posicionactual > 0) {
              this.posicionactual = this.posicionactual - this.registrosporpagina;
              if (this.posicionactual < 0) { this.posicionactual = 0};
              this.cargarLugares(this.ultimaBusqueda);
            } else {
              this.listaLugares = [];
              this.totallugares = 0;
            }
          } else {
            this.listaLugares = res['lugares'];
            this.totallugares = res['page'].total;
          }
          this.loading = false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
          this.loading = false;
        });

    }

    eliminarLugar(uid:string, nombre:string) {

      if (this.usuarioService.rol !== 'ADMIN') {
        Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
        return;
      }

      Swal.fire({
        title: 'Eliminar lugar',
        text: `Al eliminar el lugar '${nombre}' se perderán todos los datos asociados. ¿Desea continuar?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, borrar'
      }).then((result) => {
            if (result.value) {
              this.lugarService.eliminarLugar(uid)
                .subscribe( resp => {
                  this.cargarLugares(this.ultimaBusqueda);
                }
                ,(err) => {
                  Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                });
            }
        });
    }

    cargarEventos() {
      // cargamos todos los cursos
      this.eventoService.cargarEventos(0, '')
        .subscribe( res => {
          let r:any = res;
          this.eventos= r['eventos'];
        });
    }

    borrar() {
      this.buscarForm.reset();
      this.cargarLugares(this.ultimaBusqueda);
    }

    cambiarPagina( pagina: number) {
      pagina = (pagina < 0 ? 0 : pagina);
      this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
      this.cargarLugares(this.ultimaBusqueda);
    }

    ngOnDestroy() {
      this.subs$.unsubscribe();
    }

}
