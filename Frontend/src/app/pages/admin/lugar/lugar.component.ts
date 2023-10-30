import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { LugarService } from '../../../services/lugar.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Evento } from '../../../models/evento.model';
import { Usuario } from '../../../models/usuario.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-lugar',
  templateUrl: './lugar.component.html',
  styleUrls: ['./lugar.component.css']
})
export class LugarComponent implements OnInit {

  public datosForm = this.fb.group({
    uid!: [{value!: 'nuevo', disabled!: true}, Validators.required],
    nombre: ['', Validators.required ],
    id: ['', Validators.required ],
    bbox: ['', Validators.required ],
    plantas: ['', Validators.required ]
  });

  public eventos: Evento[] = [];

  public submited = false;
  public uid: string = 'nuevo';


  constructor(private fb: FormBuilder,
              private eventoService: EventoService,
              private lugarService: LugarService,
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
      this.lugarService.crearLugar( this.datosForm.value )
        .subscribe( res => {
          let r:any = res;
          this.uid = r['lugar'].uid;
          this.datosForm.get('uid')!.setValue( this.uid );
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.lugarService.actualizarLugar( this.uid, this.datosForm.value)
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
      this.lugarService.cargarLugar(this.uid)
        .subscribe( res => {
          let r:any = res;
          if (!r['lugares']) {
            this.router.navigateByUrl('/admin/lugares');
            return;
          };
          this.datosForm.get('nombre')!.setValue(r['lugares'].nombre);
          this.datosForm.get('id')!.setValue(r['lugares'].id);
          this.datosForm.get('plantas')!.setValue(r['lugares'].plantas);
          this.datosForm.get('bbox')!.setValue(r['lugares'].bbox);

          this.datosForm.markAsPristine();
          this.uid = r['lugares'].uid;
          this.submited = true;
          this.eventos = r['lugares'].eventos;
        }, (err) => {
          this.router.navigateByUrl('/admin/usuarios');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('nombre')!.setValue("");
      this.datosForm.get('id')!.setValue("");
      this.datosForm.get('plantas')!.setValue("");
      this.datosForm.get('bbox')!.setValue("");
      this.datosForm.markAsPristine();
      this.eventos = [];
    }
  }

  guardarLista( lugar: string[]) {
    this.lugarService.actualizarLista(this.uid, lugar)
      .subscribe( res => {
      },(err)=>{
        Swal.fire({icon: 'error', title: 'Oops...', text: 'Ocurrió un error, inténtelo más tarde',});
        return;
      });
  }

  nuevo() {
    this.uid = 'nuevo';
    this.datosForm.reset();
    this.submited = false;
    this.router.navigateByUrl('/admin/lugares/lugar/nuevo')
  }

  cancelar() {
    if (this.uid === 'nuevo') {
      this.router.navigateByUrl('/admin/lugares');
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

  /*cargarEventos() {
    // cargamos todos los cursos
    this.lugarService.cargarEventos(0, '')
      .subscribe( res => {
        let r:any = res;
        this.lugares = r['lugares'];
      });
  }*/

}
