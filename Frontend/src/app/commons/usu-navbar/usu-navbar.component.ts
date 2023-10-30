import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentProfileDialogComponent } from '../dialog-content-profile-dialog/dialog-content-profile-dialog.component';
import { DialogContentCrearEventoDialogComponent } from '../dialog-content-crear-evento-dialog/dialog-content-crear-evento-dialog.component';
import { NotificacionService } from 'src/app/services/notificacion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usu-navbar',
  templateUrl: './usu-navbar.component.html',
  styleUrls: ['./usu-navbar.component.css']
})
export class UsuNavbarComponent implements OnInit {
  usu = this.UsuarioService;
  public loading = true;

  public datosForm = this.fb.group({
    area: ['Categoria', Validators.required ],
    int1_fecha: ['',],
    int2_fecha: ['',],
  });
  public imagenUrl = '';
  public imagenOVH = '../../assets/images/no-imagen.png'
  listaNotificaciones: any[];
  listaNotificacionesUsu: any[] = [];
  totalNotificaciones: any;
  totalNotificacionesUsu: any;

  constructor( private fb: FormBuilder,
    private UsuarioService: UsuarioService,
    private NotificacionService: NotificacionService,
    public dialog: MatDialog ) { }

  showNotification: boolean;
  public submited = false;

  ngOnInit(): void {
    this.cargarNotis();
    this.UsuarioService.cargarUsuario(this.UsuarioService.uid)
      .subscribe( (res: any) => {
        this.imagenUrl = this.UsuarioService.imagenURL;

      });
  }
  hidden = true;

  toggleBadgeVisibility() {
    //this.hidden = !this.hidden;
  }



  cargarNotis() {
    this.NotificacionService.cargarNotificacionesTodas(0,'').subscribe( (res:any) => {
      // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
      // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
      if (res['notificaciones'].length === 0) {
          this.listaNotificaciones = [];
          this.totalNotificaciones = 0;
      } else {
        this.listaNotificaciones= res['notificaciones'];
        this.totalNotificaciones = res['page'].total;
        this.listaNotificaciones.forEach( (element:any) => {
          element.receptores.forEach( (element2:any) => {

            if(element2 == this.usu.uid){
                this.listaNotificacionesUsu.push(element);
            };
          });
        });
      }
      this.loading = false;
    }, (err) => {
      Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
      //console.warn('error:', err);
      this.loading = false;
    });

  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo)!.invalid && this.submited;
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentProfileDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }
  openDialogCrearEvento() {
    const dialogRef = this.dialog.open(DialogContentCrearEventoDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      //console.log(`Dialog result: ${result}`);
    });
  }

  enviar() {}

  logout(){
    this.UsuarioService.logout();
  }
}
