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

  // REMOVE TODOS OS CURSOS DO BANCO (apague esta linha após testar)
  await Curso.destroy({ where: {} });

  // Cursos NÃO iniciados (datas futuras) - serão listados
  const cursosPadrao = [
    { nome: 'Node.js Essencial', descricao: 'Aprenda Node.js do zero ao avançado', capa: capaImg, inicio: '2025-07-10' },
    { nome: 'React Completo', descricao: 'Desenvolvimento de SPAs com React', capa: capaImg, inicio: '2025-07-15' },
    { nome: 'Banco de Dados MySQL', descricao: 'Modelagem, SQL e otimização', capa: capaImg, inicio: '2025-07-20' },
    { nome: 'APIs RESTful com Express', descricao: 'Construa APIs modernas e seguras', capa: capaImg, inicio: '2025-07-25' },
    { nome: 'JavaScript Avançado', descricao: 'Conceitos avançados e boas práticas', capa: capaImg, inicio: '2025-08-01' },
    { nome: 'TypeScript na Prática', descricao: 'Typed JavaScript para projetos reais', capa: capaImg, inicio: '2025-08-05' },
    { nome: 'Docker para Devs', descricao: 'Containers, DevOps e deploy', capa: capaImg, inicio: '2025-08-10' },
    { nome: 'Git e GitHub', descricao: 'Controle de versão e colaboração', capa: capaImg, inicio: '2025-08-15' },
    { nome: 'Testes Automatizados', descricao: 'Jest, Mocha e Cypress', capa: capaImg, inicio: '2025-08-20' },
    // Cursos JÁ iniciados (datas passadas) - NÃO serão listados
    { nome: 'HTML e CSS Moderno', descricao: 'Web design responsivo', capa: capaImg, inicio: '2025-06-01' },
    { nome: 'Python para Iniciantes', descricao: 'Primeiros passos em Python', capa: capaImg, inicio: '2025-06-10' }
  ];
  for (const curso of cursosPadrao) {
    // Só cria se não existir curso com mesmo nome e data
    const existente = await Curso.findOne({ where: { nome: curso.nome, inicio: curso.inicio } });
    if (!existente) {
      await Curso.create(curso);
    }
  }
}

// Executa o seed a cada inicialização para incluir cursos padrão caso não existam
seedCursos();

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});