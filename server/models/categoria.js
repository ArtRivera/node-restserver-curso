const mongoose = require('mongoose');
const categoriaValidation = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

categoriaSchema.plugin(categoriaValidation, { message: '{PATH} debe ser único' });
module.exports = mongoose.model('Categoria', categoriaSchema);