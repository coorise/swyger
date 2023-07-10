import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
//import docs from '../../../doc/swagger'
import basicInfo from '../../../doc/swagger'

const swagger = () => {
  /*const swaggerDefinition = {
    // openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
      title: 'armony.doc', // Title (required)
      version: '1.0.0' // Version (required)
    },
    basePath: '/api/v1', // Base path (optional)
    schemes:
      process.env.SWAGGER_SCHEMA_HTTPS === 'true'
        ? ['https']
        : ['http', 'https'],
    securityDefinitions: {
      BearerAuth: {
        type: 'apiKey', //apiKey
        name: 'Authorization', //
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header'
      }
    }
  };*/
  const swaggerDefinition =basicInfo
  const options = {
    swaggerDefinition,
    apis: ['src/app/doc/**/*{.js,.ts}','src/app/core/**/docs/*{.js,.ts}','src/app/api/**/docs/*{.js,.ts}'] // <-- not in the definition, but in the options
  };

  const swaggerSpec = swaggerJSDoc(options);

  const swOptions = {
    explorer: true,
    swaggerOptions: {
      enableCORS: false,
    },
    customCss:
      '.swagger-ui .opblock-body pre span {color: #DCD427 !important} .swagger-ui .opblock-body pre {color: #DCD427} .swagger-ui textarea.curl {color: #DCD427} .swagger-ui .response-col_description__inner div.markdown, .swagger-ui .response-col_description__inner div.renderedMarkdown {color: #DCD427}'
  };

  return [swaggerUi.serve, swaggerUi.setup(swaggerSpec, swOptions)];
};

export default swagger;
