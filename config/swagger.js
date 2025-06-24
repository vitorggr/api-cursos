const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Cursos',
      version: '1.0.0',
      description: 'API para gerenciamento de cursos e inscrições',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de desenvolvimento'
      },
      {
        url: 'https://api-cursos-production.up.railway.app',
        description: 'Servidor de produção'
      }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'token',
          description: 'Autenticação baseada em cookie JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js'], // Caminho para os arquivos de rotas
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};