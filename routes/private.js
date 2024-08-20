import express from 'express'; // Importa o Express para criar rotas
import { PrismaClient } from '@prisma/client'; // Importa o Prisma para interagir com o banco de dados
import auth from '../middlewares/auth.js'; // Importa o middleware de autenticação

const router = express.Router();
const prisma = new PrismaClient();

// Endpoint para listar todos os usuários (rota protegida)
router.get('/listar-usuarios', async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // Busca todos os usuários no banco de dados
    res.status(200).json({ message: 'Usuários listados com sucesso', users }); // Retorna a lista de usuários
  } catch (err) {
    res.status(500).json({ message: 'Falha no servidor' }); // Trata erros do servidor
  }
});

// Endpoint para obter os dados do usuário logado (rota protegida)
router.get('/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userID }, // Busca o usuário pelo ID extraído do token JWT
    });
    
    if (!user) { // Verifica se o usuário existe
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ name: user.name }); // Retorna o nome do usuário logado
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message }); // Trata erros do servidor
  }
});

export default router; // Exporta as rotas definidas
