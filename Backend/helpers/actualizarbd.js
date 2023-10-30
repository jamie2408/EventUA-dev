const Usuario = require('../models/usuarios');
const Evento = require('../models/eventos');
const fs = require('fs');

const actualizarBD = async(path, nombreArchivo, id) => {
    const usuario = await Usuario.findById(id);
    if (!usuario) {
        return false;
    }

    const fotoVieja = usuario.imagen;
    const pathFotoVieja = `${path}/foto/${fotoVieja}`;
    if (fotoVieja && fs.existsSync(pathFotoVieja)) {
        fs.unlinkSync(pathFotoVieja);
    }

    usuario.imagen = nombreArchivo;
    await usuario.save();

    return true;

}

const actualizarBDev = async(path, nombreArchivo, id) => {
    const evento = await Evento.findById(id);
    if (!evento) {
        return false;
    }

    const fotoVieja = evento.imagen;
    const pathFotoVieja = `${path}/foto/${fotoVieja}`;
    if (fotoVieja && fs.existsSync(pathFotoVieja)) {
        fs.unlinkSync(pathFotoVieja);
    }

    evento.imagen = nombreArchivo;
    await evento.save();

    return true;

}


module.exports = { actualizarBD, actualizarBDev }