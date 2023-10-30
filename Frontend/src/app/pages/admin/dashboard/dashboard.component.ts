import { Component, OnInit } from '@angular/core';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/evento.model';
import { environment } from '../../../../environments/environment.prod';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';

import Swal from 'sweetalert2';
import { of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  title = 'Eventos pendientes';

  gridColumns = 3;
  isShow = false;

  toggleDisplay() { //función para cerrar los eventos
    this.isShow = !this.isShow;
  }

  toggleGridColumns() {
    this.gridColumns = this.gridColumns === 3 ? 4 : 3;
  }
  public loading = true;

  public totaleventos = 0;
  public posicionactual = 0;

  public todoseventos = 0;
  public activoseventos = 0;
  public usuariosActivos = 0;
  public usuariosCreadores = 0;
  public usuariosnoCreadores = 0;
  public usuariosAsistentes = 0;
  public usuariosnoAsistentes = 0;
  public arrayCreadores: any[] = [];
  public proximos: any[] = [];

  private ultimaBusqueda = '';
  public listaEventos: Evento[] = [];
  public listaEventosActivos: Evento[] = [];
  public listaEventosCreadores: Evento[] = [];
  public listaUsuariosCreadores: any[] = [];
  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  public continst = 0;
  public contpart = 0;
  public arraylugs: any[] = [];
  public subs$:any;
  public ordenado = false;
  public surveyProximos: any[] = [];
  public surveyUsers = [
    { name: 'U. creadores', value: this.usuariosCreadores },
    { name: 'U. asistentes', value: this.usuariosAsistentes }
  ];
  public surveyAsis = [
    { name: 'U. asistentes', value: this.usuariosAsistentes },
    { name: 'U. no asistentes', value: this.usuariosnoAsistentes }
  ];
  public surveyData = [
    { name: 'INSTITUCIONALES', value: this.continst },
    { name: 'PARTICULARES', value: this.contpart }
  ];
  public surveyDataLugs: any[] = [];


  constructor(
    private fb: FormBuilder,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private route: ActivatedRoute,
    private router: Router,
    private ususuarioService: UsuarioService) { }

    ngOnInit(): void {
      this.cargarEventos(this.ultimaBusqueda);
      this.cargarEventosActivos(this.ultimaBusqueda);
      this.cargarLugaresFavs(this.ultimaBusqueda);
      this.cargarUsuariosChart(this.ultimaBusqueda);
    }
    cargarEventosActivos(textoBuscar: string ){
      this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.eventoService.cargarEventosTodos( this.posicionactual, '' )
        .subscribe( (res:any) => {
          res['eventos'].forEach( (element:any) => {
            if(element.estado == 'APROBADO'){
              if(element.tipo == 'PARTICULAR'){
                this.contpart++;
              }
              else {
                this.continst++;
              }
            }
            if( this.ordenado == false ){
            let sortedDates = res['eventos'].sort((a:any,b:any) => b.fecha_in - a.fecha_in);
            //creadores de eventos
            let proximos7: any[] = [];
            var date = new Date();
            date.setDate(date.getDate() + 30);
            var today = new Date();
            var todayt = today.toISOString();

            sortedDates.forEach( (element:any) => {
              let fecha_i = element.fecha_in.split("T", 3);
              let fecha = fecha_i[0].split("-",3);
              if(element.fecha_in >= todayt && element.fecha_in <= date.toISOString()){
              proximos7.push( {
                name: fecha_i[0]+ ' ' + element.nombre ,
                value: element.asistentes.length
              })}
            });
            let sliced = proximos7.slice(0,7);
            this.surveyProximos = sliced.reverse();

            this.ordenado = true;
            }
            this.arrayCreadores.push(element.usuario.nombre);

          });
          this.surveyData = [
            { name: 'INSTITUCIONALES', value: this.continst },
            { name: 'PARTICULARES', value: this.contpart }
          ];
            let chars = this.arrayCreadores;
            let uniqueChars = [...new Set(chars)];
            this.arrayCreadores = uniqueChars;
            this.usuariosCreadores = this.arrayCreadores.length;
            this.ususuarioService.cargarUsuariosTodos( this.posicionactual, textoBuscar )
            .subscribe( (res:any) => {
              this.usuariosnoCreadores = res['usuarios'].length - this.usuariosCreadores;
              res['usuarios'].forEach( (element:any) => {
                if(element.asistidos.length > 0){
                  this.usuariosAsistentes++;
                }
              });
              this.usuariosnoAsistentes = res['usuarios'].length - this.usuariosAsistentes;
              this.surveyAsis= [
                { name: 'U. asistentes', value: this.usuariosAsistentes },
                { name: 'U. no asistentes', value: this.usuariosnoAsistentes }
              ];
              this.surveyUsers = [
                { name: 'U. creadores', value: this.usuariosCreadores },
                { name: 'U. no creadores', value: this.usuariosnoCreadores }
              ];
             });


        });
    }

    cargarLugaresFavs(textoBuscar: string ){
      let arraynames: any[] = [];
      let existe = false;
      let array: any[] = [];
      let newarr: any[] = [];
      this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.eventoService.cargarEventosTodos( this.posicionactual, '' )
        .subscribe( (res:any) => {
          res['eventos'].forEach( (element:any) => {
            this.arraylugs.push(element.lugar);
          });

          this.arraylugs.forEach( (element2:any) => {
            for (var x=0; x < arraynames.length; x++){
              if(arraynames[x]  == element2){
                existe = true;
              }
            }
            if(existe == false){
              this.arraylugs.forEach( (element3:any) => {
                if(element2 == element3 ){
                  arraynames.push(element2);
                  this.arraylugs.push(element2);
                }
              });
            }
          });
          let chars = this.arraylugs;
          let uniqueChars = [...new Set(chars)];
          this.arraylugs = uniqueChars;
          this.arraylugs.forEach( (element4:any) => {
            let cont = 0;
            this.arraylugs.forEach( (element5:any) => {
              if(element4.nombre == element5.nombre){
                cont++;
              }

            });
            newarr.push ({
              name: element4.nombre,
              value: cont
            });
          });
          //quitamos repetidos
          const key = 'name';
          let chars2 = newarr;
          let uniqueChars2 =  [...new Map(newarr.map(item =>
            [item[key], item])).values()];
          newarr = uniqueChars2;
          this.surveyDataLugs = newarr;

        });

    }

    cargarUsuariosChart( textoBuscar: string ) {
      this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.ususuarioService.cargarUsuariosTodos( this.posicionactual, textoBuscar )
        .subscribe( (res:any) => {

          // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
          // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
          res['usuarios'].forEach( (element:any) => {
            if(element.activo){
              this.usuariosActivos++;
            }
          });

        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
          this.loading = false;
        });

    }

    cargarEventos( textoBuscar: string ) {
      this.ultimaBusqueda = textoBuscar;
      this.loading = true;
      this.eventoService.cargarEventos( this.posicionactual, textoBuscar )
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

          }
          this.cargarUsuarios();
          this.loading = false;
        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
          this.loading = false;
        });

        this.eventoService.cargarEventosTodos( this.posicionactual, textoBuscar )
        .subscribe( (res:any) => {

            this.todoseventos = res['eventos'].length;
            res['eventos'].forEach( (element:any) => {
              if(element.estado == "PENDIENTE"){
                this.listaEventos.push(element);
                this.listaEventosCreadores.push(element);
              } else if(element.estado == "APROBADO"){
                this.listaEventosActivos.push(element);
                this.listaEventosCreadores.push(element);
              } else if(element.estado == "FINALIZADO"){
                this.listaEventosCreadores.push(element);
              }
            });

            this.activoseventos = this.listaEventosActivos.length;
            this.totaleventos = this.listaEventos.length;


        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
          this.loading = false;
        });

    }
    aprobarEvento(uid:string, nombre:string) {
     // Solo los admin pueden aprobar eventos

     if (this.usuarioService.rol !== 'ADMIN') {
      Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
      return;
    }
    this.eventoService.cargarEvento(uid).subscribe( res => {
      let r:any = res;
      if (!r['eventos']) {
        this.router.navigateByUrl('/admin/eventos');
        return;
      };
      let datosForm = this.fb.group({
        uid!: [uid, Validators.required],
        nombre: [r['eventos'].nombre, Validators.required ],
        max_aforo: [r['eventos'].max_aforo, Validators.required ],
        estado: ['APROBADO', Validators.required ],
        tipo: [r['eventos'].tipo, Validators.required ],
        precio: [r['eventos'].precio, Validators.required ],
        area: [r['eventos'].area, Validators.required ],
        fecha_in: [r['eventos'].fecha_in, Validators.required ],
        fecha_fin: [r['eventos'].fecha_fin, Validators.required ],
        hora: [r['eventos'].hora, Validators.required ],
        descripcion: [r['eventos'].descripcion, Validators.required ],
        lugar: [r['eventos'].lugar, Validators.required ],
        valoracion: [r['eventos'].valoracion, Validators.required ],
        usuario: [r['eventos'].usuario, Validators.required ]
      });
      this.eventoService.actualizarEvento(uid , datosForm.value).subscribe( res => {
        datosForm.markAsPristine();
      }, (err) => {
        const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
        Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
      });

    }, (err) => {
      this.router.navigateByUrl('/admin/usuarios');
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      return;
    });
    }
    rechazarEvento(uid:string, nombre:string) {
      // Solo los admin pueden rechazar eventos

      if (this.usuarioService.rol !== 'ADMIN') {
        Swal.fire({icon: 'warning', title: 'Oops...', text: 'No tienes permisos para realizar esta acción', });
        return;
      }
      this.eventoService.cargarEvento(uid).subscribe( res => {
        let r:any = res;
        if (!r['eventos']) {
          this.router.navigateByUrl('/admin/eventos');
          return;
        };
        let datosForm = this.fb.group({
          uid!: [uid, Validators.required],
          nombre: [r['eventos'].nombre, Validators.required ],
          max_aforo: [r['eventos'].max_aforo, Validators.required ],
          estado: ['RECHAZADO', Validators.required ],
          tipo: [r['eventos'].tipo, Validators.required ],
          precio: [r['eventos'].precio, Validators.required ],
          area: [r['eventos'].area, Validators.required ],
          fecha_in: [r['eventos'].fecha_in, Validators.required ],
          fecha_fin: [r['eventos'].fecha_fin, Validators.required ],
          hora: [r['eventos'].hora, Validators.required ],
          descripcion: [r['eventos'].descripcion, Validators.required ],
          lugar: [r['eventos'].lugar, Validators.required ],
          valoracion: [r['eventos'].valoracion, Validators.required ],
          usuario: [r['eventos'].usuario, Validators.required ]

        });
        this.eventoService.actualizarEvento(uid , datosForm.value).subscribe( res => {
          datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        });

      }, (err) => {
        this.router.navigateByUrl('/admin/usuarios');
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        return;
      });
    }

    cambiarPagina( pagina: number): void {
      pagina = (pagina < 0 ? 0 : pagina);
      this.registroactual = ((pagina - 1) * this.registrosporpagina >=0 ? (pagina - 1) * this.registrosporpagina : 0);
      this.cargarEventos(this.ultimaBusqueda);
    }

    refreshCard() {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/admin/dashboard']);
    });
    }

    ngOnDestroy() {
   //   this.subs$.unsubscribe();
    }

    cargarUsuarios() {

      this.ususuarioService.cargarUsuarios( 0, '' )
        .subscribe( (res:any) => {

          res['usuarios'].forEach( (element:any) => {
            var aux = false;
            this.listaEventosCreadores.forEach((element2:any) => {
              if(element.uid == element2.usuario._id && aux==false){
                aux = true;
                this.usuariosCreadores++;
              }
            })

          });

        }, (err) => {
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          //console.warn('error:', err);
        });
    }



}
