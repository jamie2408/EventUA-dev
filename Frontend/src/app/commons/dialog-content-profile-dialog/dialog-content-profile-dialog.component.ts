import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from 'src/app/services/evento.service';
import { Evento } from 'src/app/models/evento.model';
import { environment } from 'src/environments/environment';
import { Lugar } from '../../models/lugar.model';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { LugarService } from 'src/app/services/lugar.service';
import { NotificacionService } from '../../services/notificacion.service';

@Component({
  selector: 'app-dialog-content-profile-dialog',
  templateUrl: './dialog-content-profile-dialog.component.html',
  styleUrls: ['./dialog-content-profile-dialog.component.css']
})
export class DialogContentProfileDialogComponent implements OnInit {
  public loading = true;

  public totaleventos2 = 0;
  public posicionactual2 = 0;

  public todoseventos = 0;
  public activoseventos = 0;
  public usuariosActivos = 0;
  public usuariosCreadores = 0;

  private ultimaBusqueda2 = '';
  public listaEventos: Evento[] = [];
  public listaEventosActivos: Evento[] = [];
  public listaEventosCreadores: Evento[] = [];
  public listaUsuariosCreadores: any[] = [];


  // Control de paginación
  public totalregistros2: number = 0;
  public registroactual2: number = 0;
  public registrosporpagina2: number = environment.registros_por_pagina;


  // Cargar mis eventos

  gridColumns = 2;
  isShow = false;
  public estado: string= "";

  // Editar evento

  public submited = false;
  public tituloModal = 'Editar evento';
  public uidmodal = '';
  public uidevento = '';
  public usuarios: any[] = [];


  public datosForm2 = this.fb.group({
    uid!: [{value!: 'nuevo', disabled!: true}, Validators.required],
    usuario: ['', Validators.required ],
    nombre: ['', Validators.required ],
    max_aforo: ['' ],
    estado: ['PENDIENTE', Validators.required ],
    tipo: ['', Validators.required ],
    precio: ['' ],
    areas: ['' ],
    fecha_in: ['' ],
    fecha_fin: ['' ],
    hora: ['', Validators.required ],
    descripcion: [''],
    lugar: ['', Validators.required ],
    link: ['']
  });

  public datosNotificacion = this.fb.group({
    receptores: ['', Validators.required ],
    texto: ['', Validators.required ]
  });

  public lugares: Lugar[] = [];

  // Lugares más visitados
  public arraylugs: any[] = [];
  public arraymes: any[] = [];
  public arraymeses: any[] = [];

  public imagenUrl = '';
  public imagenOVH = '../../assets/images/no-imagen.png'
  public usu = this.usuarioService;
  public foto!: File;
  public subs$: Subscription = new Subscription();
  public sendpass = false;
  public showOKP = false;
  public showOKD = false;
  public fileText = 'Seleccione archivo';

  public cat: string= "";

  public fini: Date = new Date("1000-01-01");
  public ffin: Date = new Date("3000-01-01");

  public surveyData = [
    { name: 'Bikes', value: 105000 }
  ];
  public surveyData1 = [
    { name: 'Bikes', value: 105000 }
  ];
  public datosForm = this.fb.group({
    email: [ '', [Validators.required, Validators.email] ],
    nombre: [''],
    apellido: [''],
    edad: ['' ],
    imagen: ['']
  });

  public datosPassword = this.fb.group({
    password: ['', Validators.required],
    nuevopassword: ['', Validators.required],
    nuevopassword2: ['', Validators.required],
  })

  constructor(private usuarioService: UsuarioService,
    private fb: FormBuilder,
    private eventoService: EventoService,
    private router: Router,
    private lugarService: LugarService,
    private notificacionService: NotificacionService,
    public dialog: MatDialog) { }

    ngOnInit(): void {
      this.cargarUsuario();
      this.cargarEventos(this.ultimaBusqueda2);
      this.cargarEventos1(this.ultimaBusqueda2);
    }

  cambiarPassword(): void {
    this.sendpass = true;
    this.showOKP = false;
    if (this.datosPassword.invalid || this.passwordNoIgual()) { return; }
    this.usuarioService.cambiarPassword( this.usuarioService.uid, this.datosPassword.value )
      .subscribe( res => {
        this.showOKP = true;
        this.datosPassword.markAsPristine();
      }, (err) => {
          const errtext = err.error.msg || 'No se pudo cambiar la contraseña';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });

  }

  // Actualizar datos de usuario
  enviar(): void {
    if (this.datosForm.invalid) { return; }

    // Actualizamos los datos del formulario y si va bien actualizamos foto
    this.usuarioService.actualizarUsuario( this.usuarioService.uid, this.datosForm.value )
    .subscribe( (res:any) => {
      this.usuarioService.establecerdatos( res['usuario'].nombre, res['usuario'].apellido, res['usuario'].email, res['usuario'].edad );

      // Si la actualización de datos ha ido bien, entonces actualizamso foto si hay
      if (this.foto ) {
        this.usuarioService.subirFoto( this.usuarioService.uid, this.foto)
        .subscribe( (res: any) => {
          // Cambiamos la foto del navbar, para eso establecemos la imagen (el nombre de archivo) en le servicio
          this.usuarioService.establecerimagen(res['nombreArchivo']);
          // cambiamos el DOM el objeto que contiene la foto
          document.getElementById('fotoperfilnavbar')!.setAttribute('src', this.usuarioService.imagenURL);
        }, (err) => {
          const errtext = err.error.msg || 'No se pudo cargar la imagen';
          Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
          return;
        });
      }
      Swal.fire({
        icon: 'success',
        title: 'Perfil actualizado!'
      })
      this.fileText = 'Seleccione archivo';
      this.datosForm.markAsPristine(); // marcamos reiniciado de cambios
      this.showOKD = true;
    }, (err) => {
      const errtext = err.error.msg || 'No se pudo guardar los datos';
      Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
    });
  }

  // Precargar la imagen en la vista
  cambioImagen( evento: any ): void {
    if (evento.target.files && evento.target.files[0]) {
      // Comprobamos si es una imagen jpg, jpet, png
      const extensiones = ['jpeg','jpg','png'];
      const nombre: string = evento.target.files[0].name;
      const nombrecortado: string[] = nombre.split('.');
      const extension = nombrecortado[nombrecortado.length - 1];
      if (!extensiones.includes(extension)) {
        // Si no teniamos ningúna foto ya seleccionada antes, dejamos el campo pristine
        if (this.foto === null) {
          this.datosForm.get('imagen')!.markAsPristine();
        }
        Swal.fire({icon: 'error', title: 'Oops...', text: 'El archivo debe ser una imagen jpeg, jpg o png'});
        return;
      }

      let reader = new FileReader();
      // cargamos el archivo en la variable foto que servirá para enviarla al servidor
      this.foto = evento.target.files[0];
      // leemos el archivo desde el dispositivo
      reader.readAsDataURL(evento.target.files[0]);
      // y cargamos el archivo en la imagenUrl que es lo que se inserta en el src de la imagen
      reader.onload = (event) => {
        this.imagenUrl = event.target!.result!.toString();
        this.fileText = nombre;
      };
    } 
  }
  // Recupera los datos del usuario
  cargarUsuario():void {
    this.datosForm.get('nombre')!.setValue(this.usuarioService.nombre);
    this.datosForm.get('apellido')!.setValue(this.usuarioService.apellido);
    this.datosForm.get('email')!.setValue(this.usuarioService.email);
    this.datosForm.get('edad')!.setValue(this.usuarioService.edad);
    this.datosForm.get('imagen')!.setValue('');
    this.imagenUrl = this.usuarioService.imagenURL;

    //this.foto = null;
    this.fileText = 'Seleccione archivo';
    this.datosForm.markAsPristine();
  }
  formatoURL(url: string){
    let split = url.split(':')
    let URL = url;
    if(split[0] != 'https' && split[0] != 'http'){
    URL = 'https://eventua.ovh/api/upload/foto/evento/' + url;
    }
    return URL
  }
  cancelarPassword() {
    this.sendpass = false;
    this.showOKP = false;
    this.datosPassword.reset();
  }

  campoNoValido( campo: string): boolean {
    return this.datosForm.get(campo)!.invalid;
  }

  campopNoValido( campo: string): boolean {
    return this.datosPassword.get(campo)!.invalid && this.sendpass;
  }
  // Comprobar que los campos son iguales
  passwordNoIgual(): boolean {
    return !(this.datosPassword.get('nuevopassword')!.value === this.datosPassword.get('nuevopassword2')!.value) && this.sendpass;
  }

  logout(){
    this.usuarioService.logout();
  }

  //chart1
  cargarEventos(textoBuscar: string ) {
    this.ultimaBusqueda2 = textoBuscar;
    this.loading = true;
    this.eventoService.cargarEventos( this.posicionactual2, textoBuscar, this.usuarioService.uid, undefined, undefined, undefined, this.estado)
    .subscribe( (res:any) => {

      if (res['eventos'].length === 0) {
        if (this.posicionactual2 > 0) {
          this.posicionactual2 = this.posicionactual2 - this.registrosporpagina2;
          if (this.posicionactual2 < 0) { this.posicionactual2 = 0};
          this.cargarEventos(this.ultimaBusqueda2);
        } else {
          this.listaEventos = [];
          this.totaleventos2 = 0;

        }
      } else {
        this.listaEventos = res['eventos'];
        this.totaleventos2 = res['page'].total;
       // this.cargarEvento(this.listaEventos[0].uid);

      }
          this.todoseventos = res['eventos'].length;
          let eventonombre = '';
          let asis = false;
          let eneroc = 0;
          let febreroc = 0;
          let marzoc = 0;
          let abrilc = 0;
          let mayoc = 0;
          let julioc = 0;
          let junioc = 0;
          let agostoc = 0;
          let septiembrec = 0;
          let octubrec = 0;
          let noviembrec = 0;
          let diciembrec = 0;

          res['eventos'].forEach( (element:any) => { //entramos en evento
            let fecha_i = element.fecha_in.split("T", 3);
            let messplit = fecha_i[0].split("-",3);
            let mes = messplit[1];
            let messtring = '';

            switch(mes) {
              case '01': {
                //statements;
                messtring = 'Enero'
                eneroc++;
                break;
              }
              case '02': {
                //statements;
                messtring = 'Febrero'
                febreroc++;
                break;
              }
              case '03': {
                //statements;
                messtring = 'Marzo'
                marzoc++;
                break;
            }
              case '04': {
                //statements;
                messtring = 'Abril'
                abrilc++;
                break;
              }
              case '05': {
                //statements;
                messtring = 'Mayo'
                mayoc++;
                break;
            }
              case '06': {
                //statements;
                messtring = 'Junio'
                junioc++;
                break;
              }
              case '07': {
                //statements;
                messtring = 'Julio'
                julioc++;
                break;
            }
              case '08': {
                //statements;
                messtring = 'Agosto'
                agostoc++;
                break;
              }
              case '09': {
                //statements;
                messtring = 'Septiembre'
                septiembrec++;
                break;
            }
              case '10': {
                //statements;
                messtring = 'Octubre'
                octubrec++;
                break;
            }
              case '11': {
                //statements;
                messtring = 'Noviembre'
                noviembrec++;
                break;
              }
              case '12': {
                //statements;
                messtring = 'Diciembre'
                diciembrec++;
                break;
            }
           }

            let cont = 0;
            let noadd = false;
            res['eventos'].forEach( (element2:any) => { //ver cuantas veces se repite la fecha
              let fecha_i2 = element2.fecha_in.split("T", 3);
              let messplit2 = fecha_i2[0].split("-",3);
              let mes2 = messplit2[1];
              if(mes2 == mes){
                cont++;
              }
            });
            this.arraymes.forEach( (element3:any) => { //ver cuantas veces se repite el lugar
              if(element3[0] == messtring){
                noadd = true;
              }
            });
            if(noadd == false){
              //this.arraymes.push([messtring,cont]);
            }
          });
          this.surveyData = [
            { name: 'Enero', value: eneroc },
            { name: 'Febrero', value: febreroc },
            { name: 'Marzo', value: marzoc },
            { name: 'Abril', value: abrilc },
            { name: 'Mayo', value: mayoc },
            { name: 'Junio', value: junioc },
            { name: 'Julio', value: julioc },
            { name: 'Agosto', value: agostoc },
            { name: 'Septiembre', value: septiembrec },
            { name: 'Octubre', value: octubrec },
            { name: 'Noviembre', value: noviembrec },
            { name: 'Diciembre', value: diciembrec }

          ];
          this.activoseventos = this.listaEventosActivos.length;
          this.totaleventos2 = this.listaEventos.length;


      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });

  }

  cargarEventos1(textoBuscar: string ) {
    this.ultimaBusqueda2 = textoBuscar;
    this.loading = true;
    this.eventoService.cargarEventosTodos( this.posicionactual2, textoBuscar)
    .subscribe( (res:any) => {
          this.todoseventos = res['eventos'].length;

          let eneroc = 0;
          let febreroc = 0;
          let marzoc = 0;
          let abrilc = 0;
          let mayoc = 0;
          let julioc = 0;
          let junioc = 0;
          let agostoc = 0;
          let septiembrec = 0;
          let octubrec = 0;
          let noviembrec = 0;
          let diciembrec = 0;

          res['eventos'].forEach( (element:any) => { //entramos en evento
            element.asistentes.forEach((usu:any) => {
                if(this.usuarioService.uid == usu){
                  let fecha_i = element.fecha_in.split("T", 3);
                  let messplit = fecha_i[0].split("-",3);
                  let mes = messplit[1];
                  let messtring = '';
                    switch(mes) {
                      case '01': {
                        //statements;
                        messtring = 'Enero'
                        eneroc++;
                        break;
                      }
                      case '02': {
                        //statements;
                        messtring = 'Febrero'
                        febreroc++;
                        break;
                      }
                      case '03': {
                        //statements;
                        messtring = 'Marzo'
                        marzoc++;
                        break;
                    }
                      case '04': {
                        //statements;
                        messtring = 'Abril'
                        abrilc++;
                        break;
                      }
                      case '05': {
                        //statements;
                        messtring = 'Mayo'
                        mayoc++;
                        break;
                    }
                      case '06': {
                        //statements;
                        messtring = 'Junio'
                        junioc++;
                        break;
                      }
                      case '07': {
                        //statements;
                        messtring = 'Julio'
                        julioc++;
                        break;
                    }
                      case '08': {
                        //statements;
                        messtring = 'Agosto'
                        agostoc++;
                        break;
                      }
                      case '09': {
                        //statements;
                        messtring = 'Septiembre'
                        septiembrec++;
                        break;
                    }
                      case '10': {
                        //statements;
                        messtring = 'Octubre'
                        octubrec++;
                        break;
                    }
                      case '11': {
                        //statements;
                        messtring = 'Noviembre'
                        noviembrec++;
                        break;
                      }
                      case '12': {
                        //statements;
                        messtring = 'Diciembre'
                        diciembrec++;
                        break;
                    }
                  }
                  let cont = 0;
                  let noadd = false;
                  res['eventos'].forEach( (element2:any) => { //ver cuantas veces se repite la fecha
                    let fecha_i2 = element2.fecha_in.split("T", 3);
                    let messplit2 = fecha_i2[0].split("-",3);
                    let mes2 = messplit2[1];
                    if(mes2 == mes){
                      cont++;
                    }
                  });
                  this.arraymes.forEach( (element3:any) => { //ver cuantas veces se repite el lugar
                    if(element3[0] == messtring){
                      noadd = true;
                    }
                  });
                  if(noadd == false){
                    //this.arraymes.push([messtring,cont]);
                  }
                }
            });

          });
          this.surveyData1 = [
            { name: 'Enero', value: eneroc },
            { name: 'Febrero', value: febreroc },
            { name: 'Marzo', value: marzoc },
            { name: 'Abril', value: abrilc },
            { name: 'Mayo', value: mayoc },
            { name: 'Junio', value: junioc },
            { name: 'Julio', value: julioc },
            { name: 'Agosto', value: agostoc },
            { name: 'Septiembre', value: septiembrec },
            { name: 'Octubre', value: octubrec },
            { name: 'Noviembre', value: noviembrec },
            { name: 'Diciembre', value: diciembrec }

          ];
          this.activoseventos = this.listaEventosActivos.length;
          this.totaleventos2 = this.listaEventos.length;


      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });

  }

  cambiarPagina( pagina: number) {
    pagina = (pagina < 0 ? 0 : pagina);
    this.posicionactual2 = ((pagina - 1) * this.registrosporpagina2 >=0 ? (pagina - 1) * this.registrosporpagina2 : 0);
    this.cargarEventos(this.ultimaBusqueda2);
    var elem = document.getElementById('content');
    elem!.scrollTo(0,0);
  }

  eliminarEvento(uid:string, nombre:string, usu: any, receptores: any) {
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
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
          if (result.value) {
            this.eventoService.eliminarEvento(uid)
              .subscribe( resp => {

                if(receptores.length > 0){
                  this.datosNotificacion.get('receptores')!.setValue(receptores);
                  this.datosNotificacion.get('texto')!.setValue("El evento "+nombre+" al que ibas a asistir ha sido eliminado por su creador.");
                  this.notificacionService.crearNotificacion(this.datosNotificacion.value)
                    .subscribe((res:any) => {
                      this.submited = false;
                    }, (err) => {
                      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
                    });
                  }

                this.cargarEventos(this.ultimaBusqueda2);
              }
              ,(err) => {
                Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
              });
          }
      });
  }


nuevo(uid:any) {
  this.uidmodal = '';
  this.tituloModal = 'Editar evento';
  this.datosForm2.reset();
  this.cargarLugares();
  this.cargarDatos(uid);
  this.uidevento = uid;
}

cancelar() {
  this.datosForm2.reset();
}

cargarDatos(uid:any) {
  this.submited = false;

    this.eventoService.cargarEvento(uid)
    .subscribe( res => {
    let r:any = res;
    if (!r['eventos']) {
     this.router.navigateByUrl('/home');
     return;
    };
    let str = "Apples are round, and apples are juicy.";
    let fecha_i = r['eventos'].fecha_in.split("T", 3);
    let fecha_f = r['eventos'].fecha_fin.split("T", 3);
    this.datosForm2.get('uid')!.setValue(uid);
    this.datosForm2.get('nombre')!.setValue(r['eventos'].nombre);
    this.datosForm2.get('usuario')!.setValue(r['eventos'].usuario._id);
    this.datosForm2.get('tipo')!.setValue(r['eventos'].tipo);
    this.datosForm2.get('estado')!.setValue(r['eventos'].estado);
    this.datosForm2.get('max_aforo')!.setValue(r['eventos'].max_aforo);
    this.datosForm2.get('areas')!.setValue(r['eventos'].areas);
    this.datosForm2.get('precio')!.setValue(r['eventos'].precio);
    this.datosForm2.get('descripcion')!.setValue(r['eventos'].descripcion);
    this.datosForm2.get('fecha_in')!.setValue(fecha_i[0]);
    this.datosForm2.get('fecha_fin')!.setValue(fecha_f[0]);
    this.datosForm2.get('hora')!.setValue(r['eventos'].hora);
    this.datosForm2.get('lugar')!.setValue(r['eventos'].lugar._id);
    this.datosForm2.get('estado')!.setValue("PENDIENTE");
    this.datosForm2.get('link')!.setValue(r['eventos'].link);

    this.usuarios.pop();
    this.usuarios = r['eventos'].asistentes;

    this.datosForm2.markAsPristine();
 //   this.uid = r['eventos'].uid;
    this.submited = true;
    }, (err) => {
      this.router.navigateByUrl('/home');
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      return;
    });

}

enviarEvento() {

  this.submited = true;
  if (this.datosForm2.invalid) { return; }

  // ACtualizamos
  this.eventoService.actualizarEvento( this.uidevento, this.datosForm2.value)
  .subscribe( res => {
    this.datosForm2.markAsPristine();
    this.submited = false;
    $('#modalformulario').modal('toggle');
    if(this.usuarios.length > 0){
      this.datosNotificacion.get('receptores')!.setValue(this.usuarios);
      this.datosNotificacion.get('texto')!.setValue("El evento "+this.datosForm2.get('nombre')!.value+" al que ibas a asistir ha sido modificado por su creador.");
      this.notificacionService.crearNotificacion(this.datosNotificacion.value)
        .subscribe(res => {
          this.submited = false;
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo notificar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        });
      }
      this.cargarEventos(this.ultimaBusqueda2);
      Swal.fire({
        icon: 'success',
        title: 'Evento editado con éxito!'
      })
  }, (err) => {
    const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
    Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
  })


  }

  cargarLugares() {
    // cargamos todos los cursos
      this.lugarService.cargarLugares(0, '')
      .subscribe( res => {
        let r:any = res;
        this.lugares = r['lugares'];
      });
  }

  campoNoValido2( campo: string): boolean {
    return this.datosForm2.get(campo)!.invalid;
  }

  abrirEvento(uid: string){
    this.dialog.closeAll();
    this.router.navigateByUrl('/home/evento/'+uid);

  }

}
