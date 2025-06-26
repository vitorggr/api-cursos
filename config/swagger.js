const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Cursos',
            version: '1.0.0',
            description: 'API para gerenciamento de cursos e inscrições',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Servidor local' },
            { url: 'https://seu-projeto.up.railway.app', description: 'Produção' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    // Ajuste para exibir controllers e rotas corretamente
    apis: ['./routes/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};