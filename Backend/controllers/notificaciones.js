const Notificacion = require('../models/notificaciones');
const validator = require('validator');
const { validationResult } = require('express-validator');


const obtenerNotificaciones = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    const pag = req.query.pag;
    let textoBusqueda = '';
    /*const usuarios = await Usuario.find({}, 'nombre apellidos email rol').skip(desde).limit(registropp);
    const total = await Usuario.countDocuments();*/
    const id = req.query.id;

    let notificaciones, total;
    if (id) {
        if (!validator.isMongoId(id)) {
            return res.json({
                ok: false,
                msg: 'El id de la notificación debe ser válido'
            });
        }

        [notificaciones, total] = await Promise.all([
            Notificacion.findById(id).populate('receptores'),
            Notificacion.countDocuments()
        ]);

    } else {
        if (texto) {
            if (pag == 0) {
                [notificaciones, total] = await Promise.all([
                    Notificacion.find({ $or: [{ nombre: textoBusqueda }] }, 'texto').skip(desde).populate('receptores'),
                    Notificacion.countDocuments()
                ]);
            } else {
                [notificaciones, total] = await Promise.all([
                    Notificacion.find({ $or: [{ nombre: textoBusqueda }] }, 'texto').skip(desde).limit(registropp).populate('receptores'),
                    Notificacion.countDocuments()
                ]);
            }
        } else {
            if (pag == 0) {
                [notificaciones, total] = await Promise.all([
                    Notificacion.find({}, 'texto').skip(desde).populate('receptores'),
                    Notificacion.countDocuments()
                ]);
            } else {
                [notificaciones, total] = await Promise.all([
                    Notificacion.find({}, 'texto').skip(desde).limit(registropp).populate('receptores'),
                    Notificacion.countDocuments()
                ]);
            }
        }

        res.json({
            ok: true,
            msg: 'getNotificaciones',
            notificaciones,
            page: {
                desde,
                registropp,
                total
            }
        });
    }
}
const crearNotificacion = async(req, res) => {
    const {} = req.body;

    const noti = new Notificacion(req.body);
    await noti.save();
    res.json({
        ok: true,
        msg: 'crearNotificación',
        noti
    });
}

const actualizarNotificacion = async(req, res) => {
    const {...object } = req.body;
    const uid = req.params.id;

    try {
        const noti = await Notificacion.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Notificación actualizada',
            noti
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando notificación'
        });
    }

}
const borrarNotificacion = async(req, res) => {

    const uid = req.params.id;

    try {
        const existeNotificacion = await Notificacion.findById(uid);
        if (!existeNotificacion) {
            return res.status(400).json({
                ok: false,
                msg: 'La notificación no existe'
            });
        }
        const resultado = await Notificacion.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'borrarNotificación',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando notificación'
        });
    }

}
module.exports = { obtenerNotificaciones, crearNotificacion, actualizarNotificacion, borrarNotificacion }