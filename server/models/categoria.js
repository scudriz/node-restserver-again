const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let categoriaSchema = new Schema({

    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es obligatoria']
    },

    usuario: { //este nombre es el utilizado en populate para hacer la relación
        type: Schema.Types.ObjectId,
        ref: 'Usuario' //este debe ser el nombre que se exporta en el modelo
    }

});

//categoriaSchema.plugin(uniqueValidator, { message: '{PATH} Debe ser unico' });

module.exports = mongoose.model('Categoria', categoriaSchema);