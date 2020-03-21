const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'la descripcion es necesaria']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }

});

//no hace falta, de momento
categoriaSchema.methods.toJSON = function() {
    let categoria = this;
    let categoriaObject = categoria.toObject();
    // delete userObject.password;

    return categoriaObject;
}

categoriaSchema.plugin(uniqueValidator, { message: '{PATH} deber de ser único' })

module.exports = mongoose.model('Categoria', categoriaSchema);