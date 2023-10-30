/*
Ruta base: /api/usuarios
*/

const { Router } = require('express');
const { obtenerLugares, crearLugar, borrarLugar, actualizarLugar } = require('../controllers/lugares');
const { check } = require('express-validator');
const { validarCampos } = require('../middleware/validar-campos');
const { validarJWT } = require('../middleware/validar-jwt');

const router = Router();

router.get('/', obtenerLugares);
router.post('/', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('id', 'El argumento id es obligatorio').not().isEmpty(),
    check('eventos.*.usuario', 'El argumento eventos no es válido').optional().isMongoId(),
    validarCampos
], crearLugar);
router.put('/:id', [
    validarJWT,
    check('nombre', 'El argumento nombre es obligatorio').not().isEmpty(),
    check('id', 'El argumento id es obligatorio').not().isEmpty(),
    check('eventos.*.usuario', 'El argumento eventos no es válido').optional().isMongoId(),
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], actualizarLugar);
router.delete('/:id', [
    validarJWT,
    check('id', 'El identificador no es válido').isMongoId(),
    validarCampos
], borrarLugar);
module.exports = router;