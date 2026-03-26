import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MyConnect API',
      version: '1.0.0',
      description: 'API Documentation for MyConnect'
    },
  },
  apis: ['./app/api/**/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);
