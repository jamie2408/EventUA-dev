const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const UsuarioSchema = Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    fecha_reg: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },
    confirmationCode: {
        type: String,
        unique: true
    },
    nombre: {
        type: String
    },
    apellido: {
        type: String
    },
    edad: {
        type: Number
    },
    password: {
        type: String,
        required: true
    },
    imagen: {
        type: String
    },
    activo: {
        type: Boolean,
        required: true,
        default: 'true'
    },
    baneado: {
        type: Boolean,
        required: true,
        default: 'false'
    },
    rol: {
        type: String,
        required: true,
        default: 'USUARIO'
    },
    notificaciones: [{
        notificacion: {
            type: Schema.Types.ObjectId,
            ref: 'Notificacion'
        }
    }],
    asistidos: [{
        type: String
    }],
    favoritos: [{
        type: String
    }],
}, { collection: 'usuarios' });

UsuarioSchema.method('toJSON', function() {
    const { __v, _id, password, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Usuario', UsuarioSchema);