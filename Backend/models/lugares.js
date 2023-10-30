const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const LugarSchema = Schema({
    nombre: {
        type: String,
        required: true
    },
    eventos: [{ //eventos que se celebran en el lugar
        evento: {
            type: Schema.Types.ObjectId,
            ref: 'Evento'
        },
        default: []
    }],
    descripcion: {
        type: String
    },
    plantas: {
        type: String
    },
    bbox: { // coordenadas en latitud y longitud del lugar
        type: String
    },
    id: {
        type: String,
        required: true,
        unique: true
    }
}, { collection: 'lugares' });

LugarSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Lugar', LugarSchema);