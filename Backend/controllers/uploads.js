const { response } = require('express');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { actualizarBD, actualizarBDev } = require('../helpers/actualizarbd');
const fs = require('fs');

const subirArchivoEv = async(req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo'
        });
    }

    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`
        });
    }

    const tipo = req.params.tipo; //foto
    const id = req.params.id;

    const archivosValidos = {
        foto: ['jpeg', 'jpg', 'png'],
    }

    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];


    if (tipo === 'foto') {
        if (!archivosValidos.foto.includes(extension)) {
            return res.status(400).json({
                ok: false,
                msg: `El tipo de archivo '${extension}' no esta permitido (${archivosValidos.foto})`
            });
        }

    } else {
        return res.status(400).json({
            ok: false,
            msg: `El tipo de operación no está permitida`,
            tipoOperacion: tipo
        });
    }

    const path = `${process.env.PATHUPLOAD}`;
    const nombreArchivo = `${uuidv4()}.${extension}`;
    const uploadPath = `${process.env.PATHUPLOAD}/foto/evento/${nombreArchivo}`;
    archivo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
                tipoOperacion: tipo
            });
        }

        actualizarBDev(path, nombreArchivo, id)
            .then(valor => {
                if (!valor) {
                    console.log(uploadPath);
                    fs.unlinkSync(uploadPath);
                    return res.status(400).json({
                        ok: false,
                        msg: `No se ha podido actualizar la BD`,
                    });
                } else {

                    res.json({
                        ok: true,
                        msg: 'subirArchivo',
                        nombreArchivo
                    });
                }
                // controlar valor
            }).catch(error => {
                fs.unlinkSync(uploadPath);
                return res.status(400).json({
                    ok: false,
                    msg: `Error al cargar la imagen`,
                });
            });

    });




}

const subirArchivo = async(req, res) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No se ha enviado archivo'
        });
    }

    if (req.files.archivo.truncated) {
        return res.status(400).json({
            ok: false,
            msg: `El archivo es demasiado grande, permitido hasta ${process.env.MAXSIZEUPLOAD}MB`
        });
    }

    const tipo = req.params.tipo; //foto
    const id = req.params.id;

    const archivosValidos = {
        foto: ['jpeg', 'jpg', 'png'],
    }

    const archivo = req.files.archivo;
    const nombrePartido = archivo.name.split('.');
    const extension = nombrePartido[nombrePartido.length - 1];


    if (tipo === 'foto') {
        if (!archivosValidos.foto.includes(extension)) {
            return res.status(400).json({
                ok: false,
                msg: `El tipo de archivo '${extension}' no esta permitido (${archivosValidos.foto})`
            });
        }

    } else {
        return res.status(400).json({
            ok: false,
            msg: `El tipo de operación no está permitida`,
            tipoOperacion: tipo
        });
    }

    const path = `${process.env.PATHUPLOAD}`;
    const nombreArchivo = `${uuidv4()}.${extension}`;
    const uploadPath = `${process.env.PATHUPLOAD}/foto/usuario/${nombreArchivo}`;
    archivo.mv(uploadPath, (err) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                msg: `No se pudo cargar el archivo`,
                tipoOperacion: tipo
            });
        }

        actualizarBD(path, nombreArchivo, id)
            .then(valor => {
                if (!valor) {
                    console.log(uploadPath);
                    fs.unlinkSync(uploadPath);
                    return res.status(400).json({
                        ok: false,
                        msg: `No se ha podido actualizar la BD`,
                    });
                } else {

                    res.json({
                        ok: true,
                        msg: 'subirArchivo',
                        nombreArchivo
                    });
                }
                // controlar valor
            }).catch(error => {
                fs.unlinkSync(uploadPath);
                return res.status(400).json({
                    ok: false,
                    msg: `Error al cargar la imagen`,
                });
            });

    });




}

const enviarArchivo = async(req, res) => {

    const tipo = req.params.tipo; //foto
    const nombreArchivo = req.params.nombreArchivo;

    const path = `${process.env.PATHUPLOAD}`;

    const uploadPath = `${process.env.PATHUPLOAD}/foto/usuario/${nombreArchivo}`;

    if (!fs.existsSync(uploadPath)) {


        res.sendFile(`${path}/no-imagen.png`);

        /*return res.status(400).json({
            ok: false,
            msg: 'Archivo no existe',

        });*/
    } else {
        res.sendFile(uploadPath);
    }

}

const enviarArchivoEv = async(req, res) => {

    const tipo = req.params.tipo; //foto
    const nombreArchivo = req.params.nombreArchivo;

    const path = `${process.env.PATHUPLOAD}`;

    const uploadPath = `${process.env.PATHUPLOAD}/foto/evento/${nombreArchivo}`;

    if (!fs.existsSync(uploadPath)) {


        res.sendFile('https://twistedbroadway.com.au/wp-content/uploads/2019/09/Events4.jpg');

        /*return res.status(400).json({
            ok: false,
            msg: 'Archivo no existe',

        });*/
    } else {
        res.sendFile(uploadPath);
    }

}


module.exports = { subirArchivo, enviarArchivo, subirArchivoEv, enviarArchivoEv }