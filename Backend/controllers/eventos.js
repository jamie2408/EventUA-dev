const Evento = require('../models/eventos');
const validator = require('validator');
const { validationResult } = require('express-validator');

const { infoToken } = require('../helpers/infotoken');

const obtenerEventos = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    const pag = req.query.pag;
    const usu = req.query.usu;
    const cat = req.query.cat;
    const fini = req.query.fini;
    const ffin = req.query.ffin;
    const estado = req.query.estado;
    const asistidos = req.query.asistidos;
    const like = req.query.like;
    const lugar = req.query.lugar;
    let textoBusqueda = '';
    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    const id = req.query.id;

    let eventos, total;
    if (id) {
        if (!validator.isMongoId(id)) {
            return res.json({
                ok: false,
                msg: 'El id del evento debe ser válido'
            });
        }

        [eventos, total] = await Promise.all([
            Evento.findById(id).populate('asistentes', '-__v').populate('lugar', '-__v').populate('usuario', '-__v'),
            Evento.countDocuments()
        ]);

    } else {

        //añadimos a la query los filtros que recibamos
        let query = new Object();

        if (texto) query.nombre = textoBusqueda;

        if (usu) query.usuario = usu;

        if (cat) query.areas = cat;

        if (estado) query.estado = estado;

        if (lugar) query.lugar = lugar;

        if (fini) {
            if (fini === ffin) {
                query.fecha_in = { $lte: new Date(fini) };
                query.fecha_fin = { $gte: new Date(fini) };
            } else {
                query.fecha_in = { $gte: new Date(fini), $lte: new Date(ffin) };
            }
        }

        if (asistidos) query.asistentes = asistidos;

        if (like) query.likes = like;

        //console.log(query);

        if (pag == 0) {
            [eventos, total] = await Promise.all([
                Evento.find({ $or: [query] }, 'nombre imagen estado categoria areas tipo asistentes max_aforo precio fecha_in fecha_fin hora descripcion valoracion estado').skip(desde).populate('asistentes', '-__v').populate('lugar', '-__v').populate('usuario', '-__v'),
                Evento.countDocuments({ $or: [query] })
            ]);
        } else {
            [eventos, total] = await Promise.all([

                Evento.find({ $or: [query] }, 'nombre imagen estado areas categoria tipo asistentes max_aforo precio fecha_in fecha_fin hora descripcion valoracion estado').skip(desde).limit(registropp).populate('asistentes', '-__v').populate('lugar', '-__v').populate('usuario', '-__v'),
                Evento.countDocuments({ $or: [query] })
            ]);
        }

    }
    res.json({
        ok: true,
        msg: 'getEventos',
        eventos,
        page: {
            desde,
            registropp,
            total
        }
    });
}


const crearEvento = async(req, res) => {

    let newDate = new Date(req.body.fecha);
    let compImg = req.body.imagen;
    console.log(compImg);
    if (compImg == '') {
        compImg = 'https://twistedbroadway.com.au/wp-content/uploads/2019/09/Events4.jpg';
    }
    try {
        const evento = new Evento(req.body);
        evento.fecha = newDate;
        evento.imagen = compImg;
        //pasar fecha a string //var fecha_string = newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear()
        //console.log(fecha_string);
        await evento.save();
        res.json({
            ok: true,
            msg: 'crearEvento',
            evento
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando evento'
        });
    }

}

const actualizarEvento = async(req, res) => {
    const nombre = String(req.body.nombre);
    const uid = req.params.id;
    const object = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos
        if (nombre) {
            const existeNombre = await Evento.findOne({ nombre: nombre });
            if (existeNombre) {
                if (existeNombre._id != uid) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Nombre ya existe'
                    });
                }
            }
            object.nombre = nombre;
        }

        const evento = await Evento.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Evento actualizado',
            evento
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando evento'
        });
    }

}
const borrarEvento = async(req, res) => {

    const uid = req.params.id;

    try { //de momento borra buscando por nombre, está mal ya que el nombre no es único para los eventos
        const existeNombre = await Evento.findById(uid);
        if (!existeNombre) {
            return res.status(400).json({
                ok: false,
                msg: 'El evento no existe'
            });
        }
        const resultado = await Evento.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'borradoEvento',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando evento'
        });
    }

}
module.exports = { obtenerEventos, crearEvento, actualizarEvento, borrarEvento }