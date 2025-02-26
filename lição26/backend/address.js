const { kMaxLength } = require('buffer');
const { log } = require('console');
const mongoose = require('mongoose');

//modelo/estrutura do endereço
const addressSchema = new mongoose.Schema(
    {
        cep: {
            type: String,
            required: true,
        },//unique grarante que seje só 1
        logradouro: {
            type: String,
            required: true,
        },
        bairro: {
            type: String,
            required: true,
        },
        cidade: {
            type: String,
            required: true,
        },
        estado: {
            type: String,
            required: true, kMaxLength: 2
        }, // estado somente dois caracteres.(sp)
    }, {
        timestamps: true

}
);
// cria o modelo
const Address = mongoose.model('Address', addressSchema);

// exporta o modelo para o usuario
module.exports = Address;