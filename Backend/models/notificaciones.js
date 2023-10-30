const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const Shcema = mongoose.Schema;

const NotificacionSchema = Schema({
    receptores: [{
        type: String,
        required: true
    }],
    texto: {
        type: String,
        required: true
    }
}, { collection: 'notificaciones' });

NotificacionSchema.method('toJSON', function() {
    const { __v, _id, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('Notificacion', NotificacionSchema);