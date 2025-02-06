import Express  from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"; // criptografar senha
import jwt from "jsonwebtoken"; // gerar token e validar token
import dotenv from "dotenv"; // ambiente ou arquivo .env

dotenv.config();//carregar as variaveis de ambientes do arq.env

const app = Express();

app.use(Express.json());
//rota aberta
app.get('/', (req, res) => {
    res.status(200).json({message: "Bem vindo a API USER"});
});

//credenciais 
const dbuser = process.env.DB_USER;
const dbpassword = process.env.DB_PASS;

    mongoose.connect(
    `mongodb+srv://${dbuser}:${dbpassword}@projeapi.ckdsr.mongodb.net/?retryWrites=true&w=majority&appName=ProjeAPI`,
)
.then(() => {
    app.listen(3000);
    console.log("Conectado ao banco de dados");
})
.catch((err) => console.log(err));