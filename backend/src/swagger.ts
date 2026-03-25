import swaggerJsdoc from 'swagger-jsdoc';
import { swaggerSchemas } from './config/swaggerSchemas';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Gestion des candidats API',
      version: '1.0.0',
      description: 'API pour la gestion des candidats',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Serveur de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      ...swaggerSchemas.components, // fusionne les schémas
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.ts'], // chemins vers les fichiers annotés
};

const specs = swaggerJsdoc(options);
export default specs;