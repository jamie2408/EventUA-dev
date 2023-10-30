const Lugar = require('../models/lugares');
const Evento = require('../models/eventos');
const validator = require('validator');
const { validationResult } = require('express-validator');

const { infoToken } = require('../helpers/infotoken');



const obtenerLugares = async(req, res) => {

    const desde = Number(req.query.desde) || 0;
    const registropp = Number(process.env.DOCSPERPAGE);
    const texto = req.query.texto;
    const pag = req.query.pag;
    const codigo = req.query.codigo;
    let textoBusqueda = '';
    let codigoBusqueda = '';

    if (texto) {
        textoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }
    if (codigo) {
        codigoBusqueda = new RegExp(texto, 'i');
        //console.log('texto', texto, ' textoBusqueda', textoBusqueda);
    }

    const id = req.query.id;

    let lugares, total;
    if (id) {
        if (!validator.isMongoId(id)) {
            return res.json({
                ok: false,
                msg: 'El id del lugar debe ser válido'
            });
        }

        [lugares, total] = await Promise.all([
            Lugar.findById(id).populate({
                path: 'eventos',
                select: 'nombre',
            }),
            Lugar.countDocuments()
        ]);

    } else {
        if (texto) {
            if (codigo) {
                if (pag == 0) {
                    [lugares, total] = await Promise.all([
                        Lugar.find({ $or: [{ nombre: textoBusqueda, id: codigo }] }, 'nombre id eventos bbox plantas').skip(desde).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments({ $or: [{ nombre: textoBusqueda }] })
                    ]);
                } else {
                    [lugares, total] = await Promise.all([
                        Lugar.find({ $or: [{ nombre: textoBusqueda, id: codigo }] }, 'nombre id eventos bbox plantas').skip(desde).limit(registropp).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments({ $or: [{ nombre: textoBusqueda }] })
                    ]);
                }
            } else {
                if (pag == 0) {
                    [lugares, total] = await Promise.all([
                        Lugar.find({ $or: [{ nombre: textoBusqueda }] }, 'nombre id eventos bbox plantas').skip(desde).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments({ $or: [{ nombre: textoBusqueda }] })
                    ]);
                } else {
                    [lugares, total] = await Promise.all([
                        Lugar.find({ $or: [{ nombre: textoBusqueda }] }, 'nombre id eventos bbox plantas').skip(desde).limit(registropp).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments({ $or: [{ nombre: textoBusqueda }] })
                    ]);
                }
            }

        } else {
            if (codigo) {
                if (pag == 0) {
                    [lugares, total] = await Promise.all([
                        Lugar.find({ $or: [{ id: codigo }] }, 'nombre id eventos bbox plantas').skip(desde).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments()
                    ]);
                } else {
                    [lugares, total] = await Promise.all([
                        Lugar.find({ $or: [{ id: codigo }] }, 'nombre id eventos bbox plantas').skip(desde).limit(registropp).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments()
                    ]);
                }
            } else {
                if (pag == 0) {
                    [lugares, total] = await Promise.all([
                        Lugar.find({}, 'nombre id eventos bbox plantas').skip(desde).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments()
                    ]);
                } else {
                    [lugares, total] = await Promise.all([
                        Lugar.find({}, 'nombre id eventos bbox plantas').skip(desde).limit(registropp).populate({
                            path: 'eventos',
                            select: 'nombre',
                        }),
                        Lugar.countDocuments()
                    ]);
                }
            }
        }
    }

    res.json({
        ok: true,
        msg: 'getLugares',
        lugares,
        page: {
            desde,
            registropp,
            total
        }
    });
}

const crearLugar = async(req, res = response) => {
    const id = String(req.body.id).trim();
    const { eventos } = req.body;

    try {
        const existeLugar = await Lugar.findOne({ id: id });
        if (existeLugar) {
            return res.status(400).json({
                ok: false,
                msg: 'El lugar ya existe'
            });
        }

        let listaeventosinsertar = [];
        if (eventos) {
            let listaeventosbusqueda = [];
            const listaeven = eventos.map(registro => {
                if (registro.evento) {
                    listaeventosbusqueda.push(registro.evento);
                    listaeventosinsertar.push(registro);
                }
            });
            const existenEventos = await Evento.find().where('_id').in(listaeventosbusqueda);
            if (existenEventos.length != listaeventosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Algunos de los eventos indicados no existe o está repetido'
                });
            }

        }

        const lugar = new Lugar(req.body);
        lugar.id = id;
        lugar.eventos = listaeventosinsertar;
        // Almacenar en BD
        await lugar.save();
        res.json({
            ok: true,
            msg: 'Lugar creado',
            lugar,
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error creando lugar'
        });
    }
}

const actualizarLugar = async(req, res) => {
    const codigo = String(req.body.nombre).trim;
    const uid = req.params.id;
    const { eventos } = req.body;

    try { //de momento actualiza buscando por nombre, está mal ya que el nombre no es único para los eventos
        if (codigo) {
            const existeCodigo = await Lugar.findOne({ codigo: codigo });
            if (existeCodigo) {
                if (existeCodigo._id != uid) {
                    return res.status(400).json({
                        ok: false,
                        msg: 'Codigo ya existe'
                    });
                }
            }
        }

        let listaeventosinsertar = [];
        if (eventos) {
            let listaeventosbusqueda = [];
            const listaeven = eventos.map(registro => {
                if (registro.evento) {
                    listaeventosbusqueda.push(registro.evento);
                    listaeventosinsertar.push(registro);
                }
            });
            const existenEventos = await Evento.find().where('_id').in(listaeventosbusqueda);
            if (existenEventos.length != listaeventosbusqueda.length) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Algunos de los eventos indicados no existe o está repetido'
                });
            }

        }

        const object = req.body;
        object.eventos = listaeventosinsertar;

        const lugar = await Lugar.findByIdAndUpdate(uid, object, { new: true });

        res.json({
            ok: true,
            msg: 'Lugar actualizado',
            lugar
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error actualizando lugar'
        });
    }

}
const borrarLugar = async(req, res) => {

    const uid = req.params.id;

    try { //de momento borra buscando por nombre, está mal ya que el nombre no es único para los eventos
        const existeCodigo = await Lugar.findById(uid);
        if (!existeCodigo) {
            return res.status(400).json({
                ok: false,
                msg: 'El lugar no existe'
            });
        }
        const resultado = await Lugar.findByIdAndRemove(uid);

        res.json({
            ok: true,
            msg: 'borradoLugar',
            resultado
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'Error borrando lugar'
        });
    }

}
module.exports = { obtenerLugares, crearLugar, actualizarLugar, borrarLugar }