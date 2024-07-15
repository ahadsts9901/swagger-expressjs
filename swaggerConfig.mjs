import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    swaggerDefinition: {
        swagger: '2.0',
        info: {
            title: 'Express API Documentation',
            version: '1.0.0',
            description: 'Documentation for REST APIs in Expressjs',
        },
    },
    apis: ['./apiv1/routes/post.mjs'], // Path to your API routes
    // apis: ['./apiv1/*.mjs'], // Path to your API routes
};

const specs = swaggerJsdoc(options);

export default specs;