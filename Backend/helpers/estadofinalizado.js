const XMLHttpRequest = require('xhr2');
const { v4: uuidv4 } = require('uuid');
const puppeteer = require('puppeteer');

var parser = require('xml2js');

var evs = [];
let xhr = new XMLHttpRequest();

require('dotenv').config({ path: '../.env' });
// Cargamos nuestra librería de conexión a la BD, con la ruta adecuada
const { dbConnection } = require('../database/configdb');
dbConnection();

xhr.open("GET", "http://localhost:3000/api/eventos/?pag=0");
xhr.send();
xhr.onload = () => {
    if (xhr.status === 200) {
        evs = JSON.parse(xhr.response);
        for (var i = 0; i < evs.length; i++) {
            if (evs.Eventos[i].fecha_fin < Date.now()) {
                evs.Eventos[i].estado = "FINALIZADO";
                console.log(evs.Eventos[i].nombre);
                let xhr2 = new XMLHttpRequest();
                xhr2.open("PUT", "http://localhost:3000/api/eventos/" + evs.Eventos[i].uid, evs.Eventos[i]);
                xhr2.send();
            }
        }
    } else {
        console.log(`error ${xhr.status} ${xhr.statusText}`);
    }
};