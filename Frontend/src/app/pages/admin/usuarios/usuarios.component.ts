import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificacionService } from '../../../services/notificacion.service';
import { EventoService } from '../../../services/evento.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  public loading = true;

  public totalusuarios = 0;
  public posicionactual = 0;
  public registrosporpagina = environment.registros_por_pagina;

  private ultimaBusqueda = '';
  public listaUsuarios: Usuario[] = [];
  public listaEventos: any[] = [];

  public fini = new Date("1000-01-01");
  public ffin = new Date("3000-01-01");


  //Control de modal

  public datosForm = this.fb.group({

    texto: ['']
  });

  public datosForm2 = this.fb.group({
    receptores: ['', Validators.required ],
    texto: ['']
  });

  public submited = false;
  public tituloModal = 'Nueva Notificación';
  public uidmodal = '';
  public uidusuario = '';
  public uidnombre = '';
  public usuarios: any[] = [];

  constructor( private ususuarioService: UsuarioService,
                private fb: FormBuilder,
                private notificacionService: NotificacionService,
                private eventoService: EventoService) { }

  ngOnInit(): void {
    this.cargarUsuarios(this.ultimaBusqueda);
  }

  cargarUsuarios( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.ususuarioService.cargarUsuarios( this.posicionactual, textoBuscar )
      .subscribe( (res:any) => {
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['usuarios'].length === 0) {
          if (this.posicionactual > 0) {

            this.posicionactual = this.posicionactual - this.registrosporpagina;
            if (this.posicionactual < 0) { this.posicionactual = 0};
            this.cargarUsuarios(this.ultimaBusqueda);
          } else {
            this.listaUsuarios = [];
            this.totalusuarios = 0;
          }
        } else {
          this.listaUsuarios = res['usuarios'];
          this.totalusuarios = res['page'].total;
        }
        this.cantidadEventos();
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });

  }

  cantidadEventos(){

    this.fini = new Date("1000-01-01");
    this.ffin = new Date("3000-01-01");

    this.eventoService.cargarEventosTodos(0, undefined, undefined, undefined, this.fini, this.ffin)
        .subscribe((res:any) => {
          this.listaEventos = res['eventos'];
          for(let i=0;i<this.listaUsuarios.length;i++){
            var cont = 0;
            for(let j=0;j<this.listaEventos.length;j++){
              if(this.listaUsuarios[i].uid === this.listaEventos[j].usuario._id){
                cont++;
              }
            }
            this.listaUsuarios[i].edad = cont;
          }
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        });


  }

  cambiarPagina( pagina: number ){
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
    this.cargarUsuarios(this.ultimaBusqueda);
  }

  eliminarUsuario( uid: string, nombre: string, apellidos: string) {
    // Comprobar que no me borro a mi mismo
    if (uid === this.ususuarioService.uid) {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No puedes eliminar tu propio usuario',});
      return;
    }
    // Solo los admin pueden borrar usuarios
    if (this.ususuarioService.rol !== 'ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción',});
      return;
    }

    Swal.fire({
      title: 'Eliminar usuario',
      text: `Al eliminar al usuario '${nombre} ${apellidos}' se perderán todos los datos asociados. ¿Desea continuar?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrar'
    }).then((result) => {
          if (result.value) {
            this.ususuarioService.borrarUsuario(uid)
              .subscribe( resp => {
                this.cargarUsuarios(this.ultimaBusqueda);
              }
              ,(err) =>{
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                //console.warn('error:', err);
              })
          }
      });
  }

  nuevo(uid:any,nombre:any) {
    this.uidmodal = '';
    this.uidnombre = nombre;
    this.tituloModal = 'Nueva notificación';
    this.datosForm.reset();
    this.uidusuario = uid;
  }

  cancelar() {
    this.datosForm.reset();
  }

  guardar() {

    this.submited = true;
    if (this.datosForm.invalid) {return; }

    //Cargamos el evento para coger los usuarios



      //  var feed = {"usuario": };

        this.usuarios.pop();
        this.usuarios.push(this.uidusuario);
        this.datosForm2.get('receptores')!.setValue(this.usuarios);
        this.datosForm2.get('texto')!.setValue(this.datosForm.get('texto')!.value);

        this.notificacionService.crearNotificacion(this.datosForm2.value)
        .subscribe((res:any) => {
          this.submited = false;
          $('#modalformulario').modal('toggle');
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        });


  }


}
