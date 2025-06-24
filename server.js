require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const setupSwagger = require('./config/swagger');
const sequelize = require('./config/database');
require('./models');
const AuthMiddleware = require('./middlewares/AuthMiddleware');

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rotas públicas
app.use('/usuarios', require('./routes/users')); // POST /usuarios
app.use('/login', require('./routes/auth'));     // POST /login
app.use('/cursos', require('./routes/courses')); // GET /cursos (pública)

// Rotas protegidas (aplicadas dentro do arquivo de rotas)
// As rotas POST /cursos/:idCurso, DELETE /cursos/:idCurso, GET /:idUsuario já estão protegidas no arquivo de rotas

// Swagger Documentation
setupSwagger(app);

// Testar conexão com banco
sequelize.authenticate()
  .then(() => console.log('Conexão com banco estabelecida'))
  .catch(err => console.error('Erro na conexão com banco:', err));

// Iniciar servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Documentação disponível em: http://localhost:${PORT}/api-docs`);
});