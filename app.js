import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"; //Criptografa senhas
import jwt from "jsonwebtoken"; //Criar e validar tokens JWT
import dotenv from "dotenv"; //Ambiente com arquivo .env
import User from "./models/usuarioModels.js";

dotenv.config(); //Carregar as variaveis de ambientes do arquivo .evn

const app = express();

app.use(express.json());

//Rota aberta
app.get("/", (req, res) => {
  res.status(200).json({ mgs: "Bem vindo a nossa API " });
});

app.get("/user/:id", checktoken, async (req, res) => {
  const id = (res = URLSearchParams.id);

  const user = await User.findById(id, "-password");

  if (!user) {
    res.status(404).json({ mgs: "Usuario não encontrado" });
  }

  res.status(200).json({ user });
});

function checktoken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ mgs: "Acesso negado" });

  try {
    const secret = process.env.SECRET;

    jwt.verify(token, secret);

    next();
  } catch (err) {
    res.status(400).json({ msg: "O token é invalido!" });
  }
}

//Criação de usuario
app.post("/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatorio" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O Email é obrigatorio" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatorio" });
  }
  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação precisa ser iguais" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "Por favor, utilize outro E-mail" });
  }

  const salt = await bcrypt.genSalt(12); //Gera um salt para criptografar a senha
  const passwordHast = await bcrypt.hash(password, salt); //Cria um hash da senha usando o salt

  const user = new User({
    name,
    email,
    password: passwordHast,
  });

  try {
    await user.save();

    res.status(201).json({ msg: "Usuario criado com sucesso" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(422).json({ msg: "O email deve ser informado!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha deve ser informado!" });
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    return res.status(404).json({ msg: "Usuario não encontrado!" });
  }

  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return res.status(422).json({ mgs: "Senha invalida, tente novamente " });
  }

  try {
    const secret = process.env.SECRET;

    const token = jwt.sign(
      {
        id: user._id,
      },
      secret
    );

    res.status(200).json({ mgs: "Autenticação realizado com sucesso!", token });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
});

//Credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@clusterapi.gnrdo.mongodb.net/?retryWrites=true&w=majority&appName=Clusterapi`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
  })
  .catch((err) => console.log(err));
//