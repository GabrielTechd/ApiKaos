import express from 'express'; // Importa o Express para criar o servidor
import publicRoutes from './routes/public.js'; // Rotas públicas
import privateRoutes from './routes/private.js'; // Rotas privadas
import cors from 'cors'; // Habilita CORS (Cross-Origin Resource Sharing)

import auth from './middlewares/auth.js'; // Middleware de autenticação

const app = express();
app.use(express.json()); // Configura o servidor para aceitar JSON
app.use(cors()); // Permite requisições de outras origens

app.use('/', publicRoutes); // Rotas públicas, acessíveis sem autenticação
app.use('/', auth, privateRoutes); // Rotas privadas, protegidas por autenticação

app.listen(3000, () => console.log("server rodando")); // Inicia o servidor na porta 3000
