const express = require('express');
const axios = require('axios'); //biblioteca para requisições http
const mongoose = require('mongoose');
const dotenv = require('dotenv');

//importando o modelo criado
const Address = require("./address");

// carrega as variaveis de ambiente .env
dotenv.config();

// chama o express
const app = express();

//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST,');
    res.header('Access-Control-Allow-Headers', 'conternt-type');
    next();
}); 

app.get("/api/cep/:cep", async (req, res) => {
    const { cep } = req.params;

    try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'CEP não encontrado!'});
    }
});

// middlewares para parsing de JSON e URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//obtem as credenciais do mongoDB armazernado no .env
const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASS;

//cria a string de conexão com o mongoDB
const mongoURI = `mongodb+srv://${dbuser}:${dbpassword}@clusterapi.gnrdo.mongodb.net/?retryWrites=true&w=majority&appName=Clusterapi`;

//define a porta que o servidor ira executar
const PORT = 3000;

mongoose.connect(mongoURI)// conecta ao banco pelo link
    .then(() => {//quando for conectado corretamente
        console.log('Conectado ao banco de dados');// exibe uma variavel no console
        //inicia o servidor na porta definida
        app.listen(PORT, () => {
            console.log(`Servidor rodando em http://localhost:${PORT}`)
        });
    })
    .catch((err) => {
        console.log('Erro ao conectar ao mongoDB!', err);//exibe erro
    });

// rota para criar um novo endereço
app.post('/address', async (req, res) => {
    try {
        const address = new Address(req.body);
        await address.save();
        res.status(201).send(address);
    } catch (error) {
        res.status(400).send(error);
    }
});
