require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const sequelize = require('./config/database');
const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const cursoRoutes = require('./routes/curso.routes');
const inscricaoRoutes = require('./routes/inscricao.routes');
const swaggerConfig = require('./config/swagger');
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// Swagger (exibe controllers também em dev)
if (process.env.NODE_ENV !== 'production') {
  swaggerConfig(app);
}

// Routes
app.use('/', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/', cursoRoutes);
app.use('/inscricoes', inscricaoRoutes);

// Testar conexão com o banco
sequelize.authenticate()
    .then(() => console.log('✅ Conectado ao banco de dados'))
    .catch(err => console.error('❌ Erro na conexão com o banco:', err));

// Sincronizar modelos (em desenvolvimento)
sequelize.sync({ alter: true })
    .then(() => console.log('✅ Modelos sincronizados'))
    .catch(err => console.error('❌ Erro na sincronização:', err));

// Inserção automática de cursos ao iniciar
const { Curso } = require('./models');

async function seedCursos() {
  // Caminhos públicos para imagens do frontend
  const capaImg = '/vite.svg';

  const cursosPadrao = [
    { nome: 'Node.js Básico', descricao: 'Curso introdutório de Node.js', capa: capaImg, inicio: '2025-07-01' },
    { nome: 'React Essencial', descricao: 'Aprenda React do zero', capa: capaImg, inicio: '2025-07-05' },
    { nome: 'Banco de Dados MySQL', descricao: 'Modelagem e SQL', capa: capaImg, inicio: '2025-07-10' },
    { nome: 'APIs RESTful', descricao: 'Construa APIs modernas', capa: capaImg, inicio: '2025-07-15' },
    { nome: 'JavaScript Avançado', descricao: 'Conceitos avançados de JS', capa: capaImg, inicio: '2025-07-20' },
    { nome: 'TypeScript na Prática', descricao: 'Typed JavaScript', capa: capaImg, inicio: '2025-07-25' },
    { nome: 'Docker para Devs', descricao: 'Containers e DevOps', capa: capaImg, inicio: '2025-08-01' },
    { nome: 'Git e GitHub', descricao: 'Controle de versão', capa: capaImg, inicio: '2025-08-05' },
    { nome: 'Express.js Completo', descricao: 'Framework backend Node', capa: capaImg, inicio: '2025-08-10' },
    { nome: 'Testes Automatizados', descricao: 'Jest, Mocha e mais', capa: capaImg, inicio: '2025-08-15' }
  ];

  for (const curso of cursosPadrao) {
    const existe = await Curso.findOne({ where: { nome: curso.nome } });
    if (!existe) {
      await Curso.create(curso);
    }
  }
  
}

// Executa o seed a cada inicialização para incluir cursos padrão caso não existam
seedCursos();

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});