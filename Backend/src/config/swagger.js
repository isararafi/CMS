// swagger.js
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",  // OpenAPI version
    info: {
      title: "CMS API",
      version: "1.0.0",
      description: "Content Management System API documentation",
    },
     components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [], // global security (optional)
    servers: [
      {
        url: "http://localhost:8001", // Your server URL
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Path to your route files for annotations
};

// Initialize swagger-jsdoc
const swaggerDocs = swaggerJsDoc(swaggerOptions);
console.log("swagger running");



module.exports = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
