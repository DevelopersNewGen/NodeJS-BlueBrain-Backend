import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: { 
        openapi: "3.0.0",
        info: {
            title: "Blue Brain Backend API",
            version: "1.0.0",
            description: "API para un sistema de Tutorias",
            contact: {
                name: "Developers",
                email: "developersfyh@gmail.com"
            }
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' 
                    ? `https://${process.env.VERCEL_URL}/BlueBrain/v1`
                    : "http://127.0.0.1:3000/BlueBrain/v1",
                description: process.env.NODE_ENV === 'production' ? 'Production Server' : 'Development Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: [
        ...(process.env.NODE_ENV !== 'production' ? [
            "./src/auth/auth.routes.js",
            "./src/user/user.routes.js",
            "./src/subject/subject.routes.js",
            "./src/tutorial/tutorial.routes.js",
            "./src/application/application.routes.js",
            "./src/material/material.routes.js",
            "./src/privTutorial/privTutorial.routes.js",
            "./src/publicTutorial/publicTutorial.routes.js",
            "./src/report/report.routes.js"
        ] : [
            "./src/**/*.routes.js"
        ])
    ]
}

const swaggerDocs = swaggerJSDoc(options);

const swaggerOptions = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Blue Brain API Documentation"
};

export { swaggerDocs, swaggerUi, swaggerOptions };