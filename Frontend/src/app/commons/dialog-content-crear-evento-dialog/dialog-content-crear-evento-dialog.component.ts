import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Lugar } from 'src/app/models/lugar.model';
import { Evento } from 'src/app/models/evento.model';
import { Usuario } from 'src/app/models/usuario.model';
import { EventoService } from 'src/app/services/evento.service';
import { LugarService } from 'src/app/services/lugar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Observable, of } from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-dialog-content-crear-evento-dialog',
  templateUrl: './dialog-content-crear-evento-dialog.component.html',
  styleUrls: ['./dialog-content-crear-evento-dialog.component.css']
})
export class DialogContentCrearEventoDialogComponent implements OnInit {

  toppings = new FormControl();
  areas = new FormControl();
  cats = new FormControl();
  myControl = new FormControl();
  myControlLugs = new FormControl();


  selectedValue: string;
  selectedCar: string;

  listaAreas: string[] = ["SOCIALES Y JURÍDICAS", "HUMANIDADES", "DEPORTES", "CIENCIAS NATURALES", "TECNOLOGÍAS", "FICCIÓN", "EDUCACIÓN"];

  public datosForm = this.fb.group({
    uid!: [{value!: 'nuevo', disabled!: true}, Validators.required],
    usuario: [this.usuarioService.uid, Validators.required ],
    nombre: ['', Validators.required ],
    max_aforo: ['',],
    estado: ['PENDIENTE', Validators.required ],
    tipo: ['PARTICULAR', Validators.required ],
    precio: ['', ],
    areas: ['', Validators.required ],
    categoria: ['', Validators.required ],
    fecha_in: ['', ],
    fecha_ini: ['',  ],
    fecha_fin: ['',  ],
    fecha_fini: ['', ],
    link: ['', ],
    imagen: ['', ],
    hora: ['', Validators.required ],
    descripcion: ['', ],
    lugar: ['61fa8ec03ae2385280b9bb39', Validators.required ],
    valoracion: ['',  ],
  });
  public loading = true;

  public totaleventos = 0;
  public posicionactual = 0;

  public hoy: Date = new Date();

  public fechahoy: string = this.datepipe.transform(this.hoy, 'yyyy-MM-dd')!;
  public fechainicio: string;

  public todoseventos = 0;
  public activoseventos = 0;
  public usuariosActivos = 0;
  public usuariosCreadores = 0;
  public imagenUrl = '../assets/images/place_upload.png';
  public fileText = 'Seleccione archivo';
  public foto!: File;
  public filteredCats: Observable<string[]>;
  public filteredAreas: Observable<string[]>;
  public filteredLugs: Observable<string[]>;

  private ultimaBusqueda = '';
  public listaLugares: Lugar [] = [];
  public listaLugaresNombres: string [] = [];

  public listaEventos: Evento[] = [];
  public listaEventosActivos: Evento[] = [];
  public listaEventosCreadores: Evento[] = [];
  public listaUsuariosCreadores: any[] = [];
  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;

  public categorias: string[] = [];
  public asistentes: Usuario[] = [];

  public success = false;
  public submited = false;
  public uid: string = 'nuevo';


  constructor(private fb: FormBuilder,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private lugarService: LugarService,
    public datepipe: DatePipe,
    public dialog: MatDialog) { }

  step: any = 1;

  ngOnInit(): void {
    this.cargaCategorias();
    this.cargarLugares(this.ultimaBusqueda);
    this.filteredCats = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
    this.filteredLugs = this.myControlLugs.valueChanges.pipe(
      startWith(''),
      map(value => this._filterLugs(value)),
    );

  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.datosForm.get('categoria')!.setValue(this.myControl.value);

    return this.categorias.filter(option => option.toLowerCase().includes(filterValue));
  }
  private _filterLugs(value: string): string[] {
    const filterValue = value.toLowerCase();
    this.datosForm.get('lugar')!.setValue(this.myControlLugs.value);
    return this.listaLugaresNombres.filter(option => option.toLowerCase().includes(filterValue));
  }


  cargaCategorias() {
   this.categorias = ["ARQUITECTURA","ARTE","BIOLOGÍA","CIENCIAS DE LA SALUD","CIENCIAS NATURALES","CINE","COOPERACIÓN Y DESARROLLO"
   ,"DEPORTE","ECONOMÍA","F. CATALANA","F. INGLESA","F. VALENCIANA","FILOSOFÍA","FILOSOFÍA Y LETRAS","FÍSICA","GENERAL","GÉNERO",
   "GEOLOGÍA","HISTORIA","HUMANIDADES","IDIOMAS","INFORMÁTICA","INGENIERÍA","INVESTIGACIÓN","INVESTIGACIÓN MÉDICA","LECTURA",
   "MAR","MÚSICA","OCIO Y TIEMPO LIBRE","PINTURA","PSICOLOGÍA","QUÍMICA","RESIDUOS","SOCIALES Y JURÍDICAS","TEATRO",
   "TECNOLOGÍA","TELECOMUNICACIONES","TELEVISIÓN","TURISMO","TRABAJO SOCIAL","URBANISMO","VÍDEO","VIOLENCIA DE GÉNERO","VOLUNTARIADO"]
  }

  campoNoValido( campo: string) {
    return this.datosForm.get(campo)!.invalid && this.submited;
  }

  previous(){
    this.step = this.step -1;
  }

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
    } else {
    }
  }

  cargarLugares( textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.lugarService.cargarLugaresTodos( this.posicionactual, textoBuscar )
      .subscribe( (res:any) => {
        // Lo que nos llega lo asignamos a lista usuarios para renderizar la tabla
        // Comprobamos si estamos en un apágina vacia, si es así entonces retrocedemos una página si se puede
        if (res['lugares'].length === 0) {
            this.listaLugares = [];
        } else {
          this.listaLugares = res['lugares'];
          this.listaLugares.forEach(element => {
            this.listaLugaresNombres.push(element.nombre!);
          });
        }
        this.loading = false;
      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });

  }

  enviar() {
      this.submited = true;
      if (this.datosForm.invalid) { return; }

      // Estamos creando uno nuevo
        this.lugarService.cargarLugaresTodos(this.posicionactual, this.datosForm.get('lugar')!.value ) .subscribe((res:any)  => {
        this.datosForm.get('lugar')!.setValue( res['lugares'][0].uid );
        this.eventoService.crearEvento( this.datosForm.value )
          .subscribe( res => {
            let r:any = res;
            if (this.foto ) {
              this.eventoService.subirFoto( r['evento'].uid, this.foto)
              .subscribe( (res: any) => {
                // Cambiamos la foto del navbar, para eso establecemos la imagen (el nombre de archivo) en le servicio
              }, (err) => {
                const errtext = err.error.msg || 'No se pudo cargar la imagen';
                Swal.fire({icon: 'error', title: 'Oops...', text: errtext});
                return;
               });
              }
            //obtenemos el lugar a partir del nombre
            let imagenURL = 'http' + r['evento'].imagen;
            this.uid = r['evento'].uid;
            this.datosForm.get('uid')!.setValue( this.uid );
            this.datosForm.get('uid')!.setValue( this.uid );
            this.datosForm.markAsPristine();
            this.success = true;
            this.dialog.closeAll();
            Swal.fire({
              icon: 'success',
              title: 'Evento creado y pendiente de aprobación.',
              text: "No tardaremos en darte una respuesta!",
              footer: '<a href="https://eventua.ovh/home/evento/' + this.uid + '">Visita la página de tu evento</a>'
            })
          }, (err:any) => {
            const msgerror = err.error.msg || 'No se pudo completar la acción, vuelva a intentarlo';
            Swal.fire({icon: 'error', title: 'Oops...', text: msgerror,});
          })
        });

    }

    copiarFecha(){
      this.fechainicio = (<HTMLInputElement>document.getElementById("fecha_in")).value;

      (<HTMLInputElement>document.getElementById("fecha_fin")).value = (<HTMLInputElement>document.getElementById("fecha_in")).value;
      this.datosForm.get('fecha_fin')!.setValue(this.fechainicio);
      /*
      if(this.datosForm.get('fecha_fini')!.value != "" && (<HTMLInputElement>document.getElementById("fecha_in")).value < (<HTMLInputElement>document.getElementById("fecha_fini")).value){
        (<HTMLInputElement>document.getElementById("fecha_fini")).value = (<HTMLInputElement>document.getElementById("fecha_in")).value;
        this.datosForm.get('fecha_fini')!.setValue(this.fechainicio);
      }*/
    }

    comprobarFin() {
      if(!(<HTMLInputElement>document.getElementById("fecha_in")).value) {
        (<HTMLInputElement>document.getElementById("fecha_in")).value = (<HTMLInputElement>document.getElementById("fecha_fin")).value;
        this.datosForm.get('fecha_in')!.setValue((<HTMLInputElement>document.getElementById("fecha_fin")).value);
      }
      if((<HTMLInputElement>document.getElementById("fecha_fin")).value < (<HTMLInputElement>document.getElementById("fecha_in")).value){
        (<HTMLInputElement>document.getElementById("fecha_fin")).value = (<HTMLInputElement>document.getElementById("fecha_in")).value;
        this.datosForm.get('fecha_fin')!.setValue((<HTMLInputElement>document.getElementById("fecha_in")).value);
      }
    }

    comprobarInscripcion(){
      if((<HTMLInputElement>document.getElementById("fecha_in")).value < (<HTMLInputElement>document.getElementById("fecha_fini")).value){
        (<HTMLInputElement>document.getElementById("fecha_fini")).value = (<HTMLInputElement>document.getElementById("fecha_in")).value;
        this.datosForm.get('fecha_fini')!.setValue((<HTMLInputElement>document.getElementById("fecha_in")).value);
      }
    }

}

