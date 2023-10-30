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
  selector: 'app-eventostotaleschart',
  templateUrl: './eventostotaleschart.component.html',
  styleUrls: ['./eventostotaleschart.component.css']
})
export class EventostotaleschartComponent implements OnInit {
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
  public arraymes: any[] = [];
  public arraymeses: any[] = [];
  public surveyData = [
    { name: 'Bikes', value: 105000 }
  ];
  constructor(private eventoService: EventoService,
    private usuarioService: UsuarioService) { }

  ngOnInit(): void {
      this.cargarEventos(this.ultimaBusqueda);
      google.charts.load('current', {packages: ['corechart']});
      //this.buildChart(this.arraymes);
  }
  buildChart(array:any[]){

    var renderChart = (chart:any) =>{
      var data = new google.visualization.DataTable();
      data.addColumn('string', 'Lugar');
      data.addColumn('number', 'Cantidad');
      this.arraymeses.push(['Enero'],
      ['Febrero'],
      ['Marzo'],
      ['Abril'],
      ['Mayo'],
      ['Junio'],
      ['Julio'],
      ['Agosto'],
      ['Septiembre'],
      ['Octubre'],
      ['Noviembre'],
      ['Diciembre']);
      array.forEach(element=>{
        data.addRow([element[0],element[1]]);
      });
      var options = {
        legend: { position: 'none' },
        colors: ['#76b2e3']
      };
      chart().draw(data, options);
    }

    var columnChart =()=> new google.visualization.ColumnChart(document.getElementById('chart_div'));
    var callBack=()=>renderChart(columnChart);
    google.charts.setOnLoadCallback(callBack);
}

  cargarEventos(textoBuscar: string ) {
    this.ultimaBusqueda = textoBuscar;
    this.loading = true;
    this.eventoService.cargarEventos( this.posicionactual, textoBuscar, this.usuarioService.uid )
      .subscribe( (res:any) => {
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
            { name: 'Mayo', value: julioc },
            { name: 'Mayo', value: agostoc },
            { name: 'Mayo', value: septiembrec },
            { name: 'Mayo', value: octubrec },
            { name: 'Noviembre', value: noviembrec },
            { name: 'Diciembre', value: diciembrec }

          ];

          this.activoseventos = this.listaEventosActivos.length;
          this.totaleventos = this.listaEventos.length;


      }, (err) => {
        Swal.fire({icon: 'error', title: 'Oops...', text: 'No se pudo completar la acción, vuelva a intentarlo',});
        //console.warn('error:', err);
        this.loading = false;
      });

  }

  /*drawChart(){
    // Create the data table.
    var data = new google.visualization.DataTable();
      data.addColumn('string', 'Mes');
      data.addColumn('number', 'Total');

      data.addRows([
        ['Enero', 1],
        ['Febrero', 2],
        ['Marzo', 0],
        ['Abril', 12],
        ['Mayo', 5],
        ['Junio', 7],
        ['Julio', 1],
        ['Agosto', 4],
        ['Septiembre', 1],
        ['Octubre', 5],
        ['Noviembre', 5],
        ['Diciembre', 6],
      ]);

      var options = {
        title: 'Número de eventos totales por mes',
        legend: { position: 'none' },
        hAxis: {
          title: 'Mes',
          format: 'h:mm a',
          viewWindow: {
            min: [7, 30, 0],
            max: [17, 30, 0]
          }
        },
        vAxis: {
          title: 'Cantidad'
        }
      };

      var chart = new google.visualization.ColumnChart(
        document.getElementById('chart_div'));

      chart.draw(data, options);

  }*/
}
