import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; // Chave secreta para verificar tokens JWT

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization; // Obtém o cabeçalho de autorização

  if (!authHeader || !authHeader.startsWith('Bearer ')) { // Verifica se o cabeçalho está presente e começa com 'Bearer '
    return res.status(401).json({ message: 'Token não fornecido ou inválido' }); // Retorna erro se não houver token ou não estiver no formato correto
  }

  const token = authHeader.split(' ')[1]; // Extrai o token do cabeçalho

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verifica e decodifica o token JWT
    req.userID = decoded.id; // Armazena o ID do usuário decodificado no request para uso posterior
    next(); // Se tudo estiver certo, passa para o próximo middleware
  } catch (err) { // Captura erros na verificação do token
    return res.status(401).json({ message: 'Token inválido' }); // Retorna erro se o token for inválido
  }
};

export default auth;
