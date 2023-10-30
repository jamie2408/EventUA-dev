import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';
import { EventoService } from '../../../services/evento.service';
import { Evento } from '../../../models/evento.model';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';
import _ from 'lodash';
import fa from 'src/assets/libs/fullcalendar/dist/locale/fa';
declare var google:any;

@Component({
  selector: 'app-areasfavoritas',
  templateUrl: './areasfavoritas.component.html',
  styleUrls: ['./areasfavoritas.component.css']
})
export class AreasfavoritasComponent implements OnInit {
  public loading = true;

  public totaleventos = 0;
  public posicionactual = 0;

  public todoseventos = 0;
  public activoseventos = 0;
  public usuariosActivos = 0;
  public usuariosCreadores = 0;

  private ultimaBusqueda = '';
  public listaEventos: Evento[] = [];
  public listaEventosActivos: Evento[] = [];
  public listaEventosCreadores: Evento[] = [];
  public listaUsuariosCreadores: any[] = [];
  // Control de paginación
  public totalregistros: number = 0;
  public registroactual: number = 0;
  public registrosporpagina: number = environment.registros_por_pagina;
  // Lugares más visitados
  public arraylugs: any[] = [];
  public surveyData = [
    { name: 'Bikes', value: 105000 }
  ];

  constructor(private eventoService: EventoService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
      this.cargarEventos(this.ultimaBusqueda);
      google.charts.load('current', {packages: ['corechart']});
      //this.buildChart(this.arraylugs);
  }



cargarEventos(textoBuscar: string ) {
  this.ultimaBusqueda = textoBuscar;
  this.loading = true;
  this.eventoService.cargarEventos( this.posicionactual, textoBuscar, this.usuarioService.uid )
    .subscribe( (res:any) => {
        this.todoseventos = res['eventos'].length;

        let catnombre = '';
        res['eventos'].forEach( (element:any) => { //entramos en un lugar
           let cont = 0;
           let noadd = false;
          catnombre = element.categoria;
          res['eventos'].forEach( (element2:any) => { //ver cuantas veces se repite el lugar
            if(element2.categoria == catnombre){
              cont++;
            }
          });
          this.arraylugs.forEach( (element3:any) => { //ver cuantas veces se repite el lugar
            if(element3[0] == catnombre){
              noadd = true;
            }
          });
          if(noadd == false){
          this.arraylugs.push([catnombre,cont]);
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
}
