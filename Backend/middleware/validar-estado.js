const { response } = require('express');
const estadosPermitidos = ['PENDIENTE', 'APROBADO', 'RECHAZADO', 'FINALIZADO'];

const validarEstados = (req, res = response, next) => {

    const estado = req.body.estado;

    if (estado && !estadosPermitidos.includes(estado)) {
        return res.status(400).json({
            ok: false,
            msg: 'Estado no permitido'
        });
    }
    next();
}

module.exports = { validarEstados }