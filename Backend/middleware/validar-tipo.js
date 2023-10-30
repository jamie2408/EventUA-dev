const { response } = require('express');
const tiposPermitidos = ['INSTITUCIONAL', 'PARTICULAR'];

const validarTipo = (req, res = response, next) => {

    const tipo = req.body.tipo;

    if (tipo && !tiposPermitidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'Tipo no permitido'
        });
    }
    next();
}

module.exports = { validarTipo }