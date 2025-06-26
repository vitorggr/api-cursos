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

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Swagger (exibe controllers também em dev)
if (process.env.NODE_ENV !== 'production') {
  swaggerConfig(app);
}

// Routes
app.use('/auth', authRoutes);
app.use(usuarioRoutes);
app.use('/cursos', cursoRoutes);
app.use('/inscricoes', inscricaoRoutes);

// Testar conexão com o banco
sequelize.authenticate()
    .then(() => console.log('✅ Conectado ao banco de dados'))
    .catch(err => console.error('❌ Erro na conexão com o banco:', err));

// Sincronizar modelos (em desenvolvimento)
sequelize.sync({ alter: true })
    .then(() => console.log('✅ Modelos sincronizados'))
    .catch(err => console.error('❌ Erro na sincronização:', err));

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});