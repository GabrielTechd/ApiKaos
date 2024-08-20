import express from "express"; // Importa o Express para criar rotas
import bcrypt from "bcrypt"; // Importa o bcrypt para hashing de senhas
import jwt from 'jsonwebtoken'; // Importa o JWT para gerar tokens de autenticação
import { PrismaClient } from "@prisma/client"; // Importa o Prisma para interagir com o banco de dados

const prisma = new PrismaClient();
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Chave secreta para assinar tokens JWT

// Middleware de tratamento de erro
const errorHandler = (res, message) => {
  console.error(message);
  res.status(500).json({ message: "Erro, tente novamente" });
};

// Rota de cadastro de usuários
router.post("/cadastro", async (req, res) => {
  const user = req.body;

  if (!user.email || !user.name || !user.password) { // Verifica se todos os dados necessários foram fornecidos
    return res.status(400).json({ message: "Dados incompletos" });
  }

  try {
    const salt = await bcrypt.genSalt(10); // Gera um salt para a senha
    const hashPassword = await bcrypt.hash(user.password, salt); // Hashing da senha

    const userDB = await prisma.user.create({ // Cria um novo usuário no banco de dados
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });

    res.status(201).json(userDB); // Retorna os dados do usuário criado
  } catch (err) {
    errorHandler(res, "Erro ao cadastrar usuário: " + err.message); // Lida com erros no cadastro
  }
});

// Rota de login de usuários
router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    const user = await prisma.user.findUnique({ // Busca o usuário no banco de dados pelo email
      where: { email: userInfo.email },
    });

    if (!user) { // Verifica se o usuário existe
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(userInfo.password, user.password); // Compara a senha fornecida com a senha armazenada
    if (!isMatch) { // Se as senhas não coincidirem, retorna um erro
      return res.status(400).json({ message: 'Email ou senha inválido' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' }); // Gera um token JWT válido por 1 dia

    res.status(200).json(token); // Retorna o token de autenticação
  } catch (err) {
    errorHandler(res, "Erro ao realizar login: " + err.message); // Lida com erros no login
  }
});

export default router; // Exporta as rotas definidas
