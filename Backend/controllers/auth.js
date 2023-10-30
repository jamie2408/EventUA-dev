const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarios');
const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');
const { stat } = require('fs');


const token = async(req, res = response) => {

    const token = req.headers['x-token'];
    try {
        const { uid, rol, ...object } = jwt.verify(token, process.env.JWTSECRET);

        const usuarioBD = await Usuario.findById(uid);
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Token no valido',
                token: ''
            });
        }

        const nrol = usuarioBD.rol;

        const nuevotoken = await generarJWT(uid, rol);
        res.json({
            ok: true,
            msg: 'Token',
            uid: uid,
            rol: nrol,
            token: nuevotoken,
            confirmationCode: usuarioBD.confirmationCode,
            nombre: usuarioBD.nombre,
            apellido: usuarioBD.apellido,
            email: usuarioBD.email,
            edad: usuarioBD.edad,
            activo: usuarioBD.activo,
            imagen: usuarioBD.imagen,
            asistidos: usuarioBD.asistidos,
            favoritos: usuarioBD.favoritos
        });
    } catch {
        return res.status(400).json({
            ok: false,
            msg: 'Token no valido',
            token: ''
        });
    }
}

const login = async(req, res = response) => {

    const { email, password, status } = req.body;
    try {
        const usuarioBD = await Usuario.findOne({ email });
        if (!usuarioBD) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        console.log(usuarioBD.status);
        if (usuarioBD.status != "Active") {
            return res.status(400).json({
                ok: false,
                msg: "Por favor, verifica tu cuenta mediante el correo que te hemos mandado",
                token: ''
            });
        }

        const validPassword = bcrypt.compareSync(password, usuarioBD.password);
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario o contraseña incorrectos',
                token: ''
            });
        }
        const { _id, rol } = usuarioBD;

        const token = await generarJWT(usuarioBD._id, usuarioBD.rol);

        res.json({
            ok: true,
            msg: 'login',
            uid: _id,
            rol,
            token
        });


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error login',
            token: ''
        });
    }

}

const verifyUser = async(req, res) => {
    try {
        const usuarioBD = await Usuario.findOne({ confirmationCode: req.query.confirmationCode });
        if (!usuarioBD) {
            console.log("Usuario no encontrado");
            return res.status(404).send({ message: "User Not found." });
        } else {
            usuarioBD.status = "Active";
            console.log('usuario actualizado');
            const usuario = await Usuario.findByIdAndUpdate(usuarioBD._id, usuarioBD, { new: true });
            res.json({
                ok: true,
                msg: 'Usuario actualizado',
                usuario
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            ok: false,
            msg: 'error verify',
            token: ''
        });
    }
}

module.exports = { login, token, verifyUser }