import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NotificacionService } from '../../../services/notificacion.service';
import { ActivatedRoute, Router } from '@angular/router';

import Swal from 'sweetalert2';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-notificacion',
  templateUrl: './notificacion.component.html',
  styleUrls: ['./notificacion.component.css']
})
export class NotificacionComponent implements OnInit {

  public datosForm = this.fb.group({
    uid!: [{value!: 'nuevo', disabled!: true}, Validators.required],
    receptores: ['', Validators.required],
    texto: ['', Validators.required ],
  });


  public submited = false;
  public uid: string = 'nuevo';
  public receps: Usuario[] ;

  constructor(private fb: FormBuilder,
    private notificacionService: NotificacionService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid')!.setValue(this.uid);
    this.cargarDatos();
  }
  findInvalidControls() {
    const invalid = [];
    const controls = this.datosForm.controls;
    for (const name in controls) {
        if (controls[name].status != "VALID") {
            invalid.push(name);
        }
    }
    return invalid;
  }

  enviar() {
    this.submited = true;
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.uid === 'nuevo') {
      this.notificacionService.crearNotificacion( this.datosForm.value )
        .subscribe( res => {
          let r:any = res;
          this.uid = r['notificacion'].uid;
          this.datosForm.get('uid')!.setValue( this.uid );
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.notificacionService.actualizarNotificacion( this.uid, this.datosForm.value)
        .subscribe( res => {
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    }

  }

  cargarDatos() {
    this.submited = false;
    if (this.uid !== 'nuevo') {
      this.notificacionService.cargarNotificacion(this.uid)
        .subscribe( res => {
          let r:any = res;
          if (!r['notificaciones']) {
            this.router.navigateByUrl('/admin/notificaciones');
            return;
          };
          this.datosForm.get('receptores')!.setValue(r['notificaciones'].receptores);
          this.datosForm.get('texto')!.setValue(r['notificaciones'].texto);
          this.datosForm.markAsPristine();
          this.uid = r['notificaciones'].uid;
          this.submited = true;
        }, (err) => {
          this.router.navigateByUrl('/admin/notificaciones');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('receptores')!.setValue("");
      this.datosForm.get('texto')!.setValue("");
      this.datosForm.markAsPristine();
      }
    }
    cancelar() {
      if (this.uid === 'nuevo') {
        this.router.navigateByUrl('/admin/notificaciones');
      } else {
        this.cargarDatos();
      }
    }

    campoNoValido( campo: string) {
      return this.datosForm.get(campo)!.invalid && this.submited;
    }

    esnuevo(): boolean {
      if (this.uid === 'nuevo') { return true; }
      return false;
    }
  }


