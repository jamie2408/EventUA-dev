const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const EventoSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    lugar: { //de momento string, pero en un futuro será un type: Lugar
        type: Schema.Types.ObjectId,
        ref: 'Lugar',
        required: true
    },
    asistentes: [{
        type: String
    }],
    max_aforo: {
        type: Number
    },
    estado: {
        type: String,
        default: "PENDIENTE"
    },
    descripcion: {
        type: String,
        default: "Sin descripción"
    },
    tipo: {
        type: String,
        required: true
    },
    precio: {
        type: Number
    },
    areas: [{
        type: String,
        required: true
    }],
    categoria: {
        type: String,
        default: "UNIVERSIDAD"
    },
    FechaInicioInscripcion: {
        type: Date
    },
    FechaFinInscripcion: {
        type: Date
    },
    fecha_in: {
        type: Date,
    },
    fecha_fin: {
        type: Date
    },
    hora: {
        type: String,
        default: 'Sin horario'
    },
    valoraciones: [{
        Key: String,
        Value: Number
    }],
    numlikes: {
        type: Number,
        default: 0
    },
    likes: [{
        type: String
    }],
    imagen: {
        type: String,
        default: 'https://images.pexels.com/photos/433452/pexels-photo-433452.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940'
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    },
    link: {
        type: String,
        default: 'Sin link'
    }
}, { collection: 'eventos' });

EventoSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Evento', EventoSchema);