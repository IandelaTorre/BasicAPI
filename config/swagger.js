// swagger.js
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API básica para hacer pruebas de peticiones',
      version: '1.0.0',
      description: 'Documentación generada automáticamente con Swagger',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJSDoc(options);

module.exports = swaggerDocs;
