/*
Ruta base: /api/eventos
*/

const { Router } = require('express');
const { obtenerEventos, crearEvento, borrarEvento, actualizarEvento } = require('../controllers/eventos');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarTipo } = require('../middleware/validar-tipo');
const { validarJWT } = require('../middleware/validar-jwt');
const { validarEstados } = require('../middleware/validar-estado');



const router = Router();

router.get('/', obtenerEventos);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('lugar', 'El argumento lugar es obligatorio').not().isEmpty(),
    check('tipo', 'El argumento tipo es obligatorio').not().isEmpty(),
    check('fecha_in', 'El argumento fecha inicio es obligatorio').not().isEmpty(),
    validarCampos,
    validarEstados,
    validarTipo
], crearEvento);
router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('lugar', 'El argumento lugar es obligatorio').not().isEmpty(),
    check('tipo', 'El argumento tipo es obligatorio').not().isEmpty(),
    check('fecha_in', 'El argumento fecha inicio es obligatorio').not().isEmpty(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos,
    validarEstados,
    validarTipo
], actualizarEvento);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarEvento);
module.exports = router;