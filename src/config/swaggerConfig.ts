import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';


const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'API for my Node.js example app',
        },
        servers: [
            {
                url: 'http://localhost:8080',
            },
        ],
    },
    apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export { swaggerSpec, swaggerUi };
