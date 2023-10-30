import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { EventoService } from '../../../services/evento.service';
import { LugarService } from '../../../services/lugar.service';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Lugar } from '../../../models/lugar.model';
import { Usuario } from '../../../models/usuario.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-evento',
  templateUrl: './evento.component.html',
  styleUrls: ['./evento.component.css']
})
export class EventoComponent implements OnInit {

  public datosForm = this.fb.group({
    uid!: [{value!: 'nuevo', disabled!: true}, Validators.required],
    usuario: ['', Validators.required ],
    nombre: ['', Validators.required ],
    max_aforo: ['' ],
    estado: ['PENDIENTE', Validators.required ],
    tipo: ['' ],
    precio: ['' ],
    areas: ['', Validators.required ],
    fecha_in: ['' ],
    fecha_fin: ['' ],
    FechaInicioInscripcion: [''],
    FechaFinInscripcion: [''],
    hora: ['' ],
    descripcion: ['' ],
    lugar: ['', Validators.required ],
    valoracion: ['' ],
    link: ['' ]
  });

  public lugares: Lugar[] = [];
  public asistentes: Usuario[] = [];

  public submited = false;
  public uid: string = 'nuevo';


  constructor(private fb: FormBuilder,
              private eventoService: EventoService,
              private lugarService: LugarService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit(): void {
    this.cargarLugares();
    this.uid = this.route.snapshot.params['uid'];
    this.datosForm.get('uid')!.setValue(this.uid);
    this.cargarDatos();
  }


  enviar() {

    this.submited = true;
    if (this.datosForm.invalid) { return; }

    // Si estamos creando uno nuevo
    if (this.uid === 'nuevo') {
      this.eventoService.crearEvento( this.datosForm.value )
        .subscribe( res => {
          let r:any = res;
          this.uid = r['evento'].uid;
          this.datosForm.get('uid')!.setValue( this.uid );
          this.datosForm.markAsPristine();
        }, (err) => {
          const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
          Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
        })
    } else {
      // ACtualizamos
      this.eventoService.actualizarEvento( this.uid, this.datosForm.value)
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
      this.eventoService.cargarEvento(this.uid)
        .subscribe( res => {
          let r:any = res;
          if (!r['eventos']) {
            this.router.navigateByUrl('/admin/eventos');
            return;
          };
          let str = "Apples are round, and apples are juicy.";
          let fecha_i = r['eventos'].fecha_in.split("T", 3);
          let fecha_f = r['eventos'].fecha_fin.split("T", 3);
          let fecha_ii = r['eventos'].FechaInicioInscripcion.split("T", 3);
          let fecha_fi = r['eventos'].FechaFinInscripcion.split("T", 3);
          this.datosForm.get('nombre')!.setValue(r['eventos'].nombre);
          this.datosForm.get('usuario')!.setValue(r['eventos'].usuario._id);
          this.datosForm.get('tipo')!.setValue(r['eventos'].tipo);
          this.datosForm.get('estado')!.setValue(r['eventos'].estado);
          this.datosForm.get('max_aforo')!.setValue(r['eventos'].max_aforo);
          this.datosForm.get('areas')!.setValue(r['eventos'].areas);
          this.datosForm.get('precio')!.setValue(r['eventos'].precio);
          this.datosForm.get('descripcion')!.setValue(r['eventos'].descripcion);
          this.datosForm.get('fecha_in')!.setValue(fecha_i[0]);
          this.datosForm.get('fecha_fin')!.setValue(fecha_f[0]);
          this.datosForm.get('FechaInicioInscripcion')!.setValue(fecha_ii[0]);
          this.datosForm.get('FechaFinInscripcion')!.setValue(fecha_fi[0]);
          this.datosForm.get('hora')!.setValue(r['eventos'].hora);
          this.datosForm.get('lugar')!.setValue(r['eventos'].lugar._id);
          this.datosForm.get('valoracion')!.setValue(r['eventos'].valoracion);
          this.datosForm.get('link')!.setValue(r['eventos'].link);

          this.datosForm.markAsPristine();
          this.uid = r['eventos'].uid;
          this.submited = true;
          this.asistentes = r['eventos'].asistentes;
        }, (err) => {
          this.router.navigateByUrl('/admin/usuarios');
          Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
          return;
        });
    } else {
      this.datosForm.get('nombre')!.setValue('');
      this.datosForm.get('usuario')!.setValue('');
      this.datosForm.get('tipo')!.setValue('');
      this.datosForm.get('estado')!.setValue('');
      this.datosForm.get('max_aforo')!.setValue('');
      this.datosForm.get('area')!.setValue('');
      this.datosForm.get('precio')!.setValue('');
      this.datosForm.get('descripcion')!.setValue('');
      this.datosForm.get('fecha_in')!.setValue('');
      this.datosForm.get('fecha_fin')!.setValue('');
      this.datosForm.get('FechaInicioInscripcion')!.setValue('');
      this.datosForm.get('FechaFinInscripcion')!.setValue('');
      this.datosForm.get('hora')!.setValue('');
      this.datosForm.get('lugar')!.setValue('');
      this.datosForm.get('valoracion')!.setValue('');
      this.datosForm.get('link')!.setValue('');
      this.datosForm.markAsPristine();
      this.asistentes = [];
    }
  }

  guardarLista( evento: string[]) {
    this.eventoService.actualizarLista(this.uid, evento)
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
    this.router.navigateByUrl('/admin/eventos/evento/nuevo')
  }

  cancelar() {
    if (this.uid === 'nuevo') {
      this.router.navigateByUrl('/admin/eventos');
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

  cargarLugares() {
    // cargamos todos los cursos
    this.lugarService.cargarLugares(0, '')
      .subscribe( res => {
        let r:any = res;
        this.lugares = r['lugares'];
      });
  }

}

