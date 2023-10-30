// Generador de identificadores únicos para campos que sean unique

const { v4: uuidv4 } = require('uuid');
// Incluir los models que necesitemos para almacenar datos
const Evento = require('../models/eventos');


// Cargar el archivo de configuración
// dentro de config() pasamos el path (la ruta) donde está el archivo .env
require('dotenv').config({ path: '../.env' });
// Cargamos nuestra librería de conexión a la BD, con la ruta adecuada
const { dbConnection } = require('../database/configdb');
dbConnection();
// Creamo una función que genere y almacene datos
const crearEventos = async() => {
        // Declaramos variso arrays con datos estáticos, listas de nombres, direcciones, tipos, etc que vamos a utilizar
        const nombreEventos = ["Quedada", "Partido", "Conferencia"];
        const estados = ["PENDIENTE", "APROBADO", "RECHAZADO", "FINALIZADO"];
        const tipos = ["PARTICULAR"]
        const usuarios = ["6220c27d9d14632db4c0005d", ""];
        const horas = ['20:00', '21:00', 'De 10:00 a 12:00', '10:30', '17:00', '.']
        const lugares = ["627a5bcab81c8869f047fd2e", "627a5bc6b81c8869f047fd2b", "627a5bbdb81c8869f047fd28", "627a5bbdb81c8869f047fd28"];
        const areas = ["SOCIALES Y JURÍDICAS", "HUMANIDADES", "DEPORTES", "CIENCIAS NATURALES", "TECNOLOGÍAS", "FICCIÓN", "EDUCACIÓN", "."];
        const categorias = ["VOLUNTARIADO", "COOPERACIÓN Y DESARROLLO", "ARTE", "."];
        const unico = uuidv4();
        // A partir de los arrays anteriores, eligiendo posiciones al azar para extrar un nombr, direccion, etc
        const nombre = nombreEventos[Math.floor((Math.random() * (nombreEventos.length - 1)))] + ' (' + unico + ')';
        const descripcion = 'Descripcion del evento ' + nombre;
        const estado = estados[0 /*Math.floor((Math.random() * (estados.length() - 1)))*/ ];
        const tipo = tipos[Math.floor((Math.random() * (tipos.length - 1)))];
        const max_aforo = Math.floor((Math.random() * (500 - 20 + 1)) + 20);
        const lugar = lugares[Math.floor((Math.random() * (lugares.length - 1)))];
        const usuario = usuarios[Math.floor((Math.random() * (usuarios.length - 1)))];
        const precio = Math.floor((Math.random() * (120 - 3 + 1)) + 3);
        const valoracion = Math.floor((Math.random() * 5) + 1);
        const hora = horas[Math.floor((Math.random() * (horas.length - 1)))];
        const areaev = [areas[Math.floor((Math.random() * (areas.length - 1)))], areas[Math.floor((Math.random() * (areas.length - 1)))]];
        const categoria = categorias[Math.floor((Math.random() * (categorias.length - 1)))];
        const numlikes = Math.floor((Math.random() * (120 - 3 + 1)) + 3);


        // Generar fechas aleatorias, a partir del día de hoy
        let fecha = new Date(Date.now());
        // Añadimos a fecha un número al azar entre 1 y 90
        fecha.setDate(fecha.getDate() + Math.floor((Math.random() * 90) + 1));
        let fecha_ini = fecha;
        // Añadimos a la fecha mofificada un número de horas al azar entre 1 y 8
        fecha.getHours(fecha.getHours() + Math.floor((Math.random() * 8) + 1));
        let fecha_fin = fecha;
        fecha.setDate(fecha.getDate() + Math.floor((Math.random() * 90) + 1));
        let fecha_fins = fecha;
        // Añadimos a la fecha mofificada un número de horas al azar entre 1 y 8
        fecha.getHours(fecha.getHours() + Math.floor((Math.random() * 8) + 1));
        let fecha_iins = fecha;
        // Construimos un objeto con la estructura que espera el modelo y los datos generados
        const datos = {
            lugar: lugar,
            descripcion: descripcion,
            nombre: nombre,
            max_aforo: max_aforo,
            fecha_in: fecha_ini,
            fecha_fin: fecha_fin,
            estado: estado,
            tipo: tipo,
            precio: precio,
            hora: hora,
            categoria: categoria,
            areas: areaev,
            usuario: usuario,
            numlikes: numlikes,
            FechaFinInscripcion: fecha_fins,
            FechaInicioInscripcion: fecha_iins
        };
        // Lo imprimimos por pantalla
        console.log(datos);
        // Creamos un objeto de moongose del modelo con los datos a guardar
        const nuevoEvento = new Evento(datos);
        // Guardamos en BD
        await nuevoEvento.save();
    }
    // Bucle para llamar a la función las veces que queramos, así insertamos 1 o 1000 elementos
for (let index = 0; index < 20; index++) {
    crearEventos();
}