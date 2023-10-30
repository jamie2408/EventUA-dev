/*
Ruta base: /api/eventos
*/

const { Router } = require('express');
const { obtenerNotificaciones, crearNotificacion, borrarNotificacion, actualizarNotificacion } = require('../controllers/notificaciones');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', validarJWT, obtenerNotificaciones);
router.post('/', [
    validarJWT,
    check('receptores', 'Al menos debe existir un receptor').not().isEmpty(),
    check('texto', 'El argumento texto es obligatorio').not().isEmpty(),
    validarCampos
], crearNotificacion);
router.put('/:id', [
    validarJWT,
    check('receptores', 'Al menos debe existir un receptor').not().isEmpty(),
    check('texto', 'El argumento lugar es obligatorio').not().isEmpty(),
    validarCampos
], actualizarNotificacion);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarNotificacion);
module.exports = router;