// Inclusión de eventos de la agenda universitaria
const XMLHttpRequest = require('xhr2');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');

var parser = require('xml2js');

// Incluir los models que necesitemos para almacenar datos
const Evento = require('../models/eventos');
const Lugar = require('../models/lugares');
const l = require('../controllers/lugares');
require('dotenv').config({ path: '../.env' });
// Cargamos nuestra librería de conexión a la BD, con la ruta adecuada
const { dbConnection } = require('../database/configdb');
dbConnection();
//atributos evento
var titulo = '';
var lugar = '620956e9ee649f30f76b1fee';
var fecha_ini = new Date(Date.now());
var fecha_fin = new Date(Date.now());
var fecha_inii = new Date(Date.now());
var fecha_fini = new Date(Date.now());
var hoy = new Date(Date.now());
var url_img = '';
var link = '';
var materia = '';
var horario = '';
var areas = [];
var nombresarr = [];
var usuario = "627a5bd1b81c8869f047fd31";
//cargamos lugares
var lugs = [];
var evs = [];
let xhr = new XMLHttpRequest();

xhr.open("GET", "http://localhost:3000/api/lugares/?pag=0");
xhr.send();
xhr.onload = () => {
    if (xhr.status === 200) {
        lugs = JSON.parse(xhr.response);
    } else {
        console.log(`error ${xhr.status} ${xhr.statusText}`);
    }
};

let xhr2 = new XMLHttpRequest();

xhr2.open("GET", "http://localhost:3000/api/eventos/?pag=0");
xhr2.send();
xhr2.onload = () => {
    if (xhr2.status === 200) {
        evs = JSON.parse(xhr2.response);

    } else {
        console.log(`error ${xhr2.status} ${xhr2.statusText}`);
    }
};
//llamada url API agenda universitaria
let request = new XMLHttpRequest();
request.open("GET", "http://cvnet.cpd.ua.es/AgendaUA//SmartUniv/Activitats");
request.send();
request.onload = () => {
    if (request.status === 200) {
        // by default the response comes in the string format, we need to parse the data into JSON
        //console.log(request.response);
        var res = JSON.parse(request.responseText);
        console.log(res.Eventos.es[0].Titulo);
        for (var i = 0; i < res.Eventos.es.length; i++) {
            //console.log(`${key}: ${value}`);
            //console.log(key);
            //comprobar que el evento está disponible según su fecha de fin de inscripción e inicio de evento
            //nombre
            titulo = res.Eventos.es[i].Titulo;
            //lugar 
            for (var x = 0; x < lugs.lugares.length; x++) {
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("aulario i")) {
                    lugar = "61fa8ec53ae2385280b9bba2";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("aulario ii")) {
                    lugar = "61fa8ec13ae2385280b9bb5a";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("aulario iii")) {
                    lugar = "61fa8ec53ae2385280b9bbae";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("politécnica i")) {
                    lugar = "61fa8eca3ae2385280b9bc14";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("politécnica ii")) {
                    lugar = "61fa8ec93ae2385280b9bbff";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("politécnica iii")) {
                    lugar = "61fa8ec73ae2385280b9bbd2";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("politécnica iv")) {
                    lugar = "61fa8ec73ae2385280b9bbcc";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("museo") || res.Eventos.es[i].Lugar.toLowerCase().includes("museo.") || res.Eventos.es[i].Lugar.toLowerCase().includes("mua")) {
                    lugar = "61fa8ec03ae2385280b9bb45";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("biblioteca")) {
                    lugar = "61fa8ec33ae2385280b9bb7e";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("paraninfo")) {
                    lugar = "621e544c781f5a936088b45a";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("online")) {
                    lugar = "621e56c8781f5a936088b4fb";
                }
                if (res.Eventos.es[i].Lugar.toLowerCase().includes("museo") || res.Eventos.es[i].Lugar.toLowerCase().includes("museo.") || res.Eventos.es[i].Lugar.toLowerCase().includes("mua")) {
                    lugar = "61fa8ec03ae2385280b9bb45";

                } else {
                    if (res.Eventos.es[i].Lugar.toLowerCase().includes(lugs.lugares[x].nombre.toLowerCase())) {
                        lugar = lugs.lugares[x].uid;
                    }
                }
            };

            function isValidDate(d) {
                return d instanceof Date && !isNaN(d);
            }

            //fecha inicio inscripción
            if (isValidDate(new Date(res.Eventos.es[i].FechaInicioInscripcion))) {
                fecha_inii = new Date(res.Eventos.es[i].FechaInicioInscripcion);
            } else {
                fecha_inii = new Date('December 17, 2010 13:24:00');
            }
            //fecha fin inscripción
            if (isValidDate(new Date(res.Eventos.es[i].FechaFinInscripcion))) {
                fecha_fini = new Date(res.Eventos.es[i].FechaFinInscripcion);
            } else {
                fecha_fini = new Date('December 17, 2010 13:24:00');

            }
            //fecha inicio
            if (isValidDate(new Date(res.Eventos.es[i].FechaInicioRealizacion))) {
                fecha_ini = new Date(res.Eventos.es[i].FechaInicioRealizacion);
            } else {
                fecha_ini = new Date('December 17, 2010 13:24:00');
            }
            //fecha fin
            if (isValidDate(new Date(res.Eventos.es[i].FechaFinRealizacion))) {
                fecha_fin = new Date(res.Eventos.es[i].FechaFinRealizacion);
            } else {
                fecha_fin = new Date('December 17, 2010 13:24:00');
            }

            //categoria
            for (var i1 = 0; i1 < res.Materias.length; i1++) {
                let es = false;
                Object.entries(res.Materias[i1]).forEach((entry2) => {
                    const [key2, value2] = entry2;
                    //console.log(`${key2}: ${value2}`);
                    if (key2 == 'Id') {
                        if (value2 == res.Eventos.es[i].Materia) {
                            es = true;
                        }
                    }
                    if (key2 == 'Nombre_es' && es == true) {
                        materia = value2;
                    }
                });
            }
            areas = []
            for (var i2 = 0; i2 < res.Areas.length; i2++) {
                let es = false;
                Object.entries(res.Areas[i2]).forEach((entry3) => {
                    const [key3, value3] = entry3;
                    //console.log(`${key3}: ${value3}`);
                    //console.log(value);
                    if (key3 == 'Id') {
                        //console.log(value3);
                        if (res.Eventos.es[i].Areas.includes(value3)) {
                            es = true;
                        }
                    }
                    if (key3 == 'Nombre_es' && es == true) {
                        areas.push(value3);
                    }
                });
            }

            //imagen
            url_img = res.Eventos.es[i].UrlImagen;
            link = res.Eventos.es[i].UrlEvento;
            //hora
            horario = res.Eventos.es[i].Horario;

            const datos = {
                lugar: lugar,
                nombre: titulo,
                fecha_in: fecha_ini,
                fecha_fin: fecha_fin,
                estado: 'APROBADO',
                tipo: 'INSTITUCIONAL',
                hora: horario,
                categoria: materia,
                areas: areas,
                imagen: url_img,
                FechaInicioInscripcion: fecha_inii,
                FechaFinInscripcion: fecha_fini,
                usuario: usuario,
                link: link
            };

            if (titulo != '') {
                // Creamos un objeto de moongose del modelo con los datos a guardar
                let existe = false;
                for (var e = 0; e < evs.eventos.length; e++) {
                    if (evs.eventos[e].nombre == titulo) {
                        existe = true;
                    }
                }
                if (existe) {
                    //no guardar
                } else {
                    const nuevoEvento = new Evento(datos);
                    // Guardamos en BD
                    nuevoEvento.save();
                }

            }
        }

    } else {
        console.log(`error ${request.status} ${request.statusText}`);
    }
};