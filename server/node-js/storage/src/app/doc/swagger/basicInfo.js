import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand'
import {version} from '@rootApp/package.json'
dotenvExpand.expand(dotenv.config())
export default {
    // openapi: '3.0.0', // Specification (optional, defaults to swagger: '2.0')
    info: {
        title:process.env.APP_NAME || 'Swyger-Doc',
        description: process.env.APP_DESCRIPTION ||'Swyger-Doc',
        version: process.env.APP_VERSION ||version,
        contact: {
            name: "@swyger/storage",
            email: "swyger.support@agglomy.com",
            url: "https://swyger.agglomy.com", // your website
        },
    },
    basePath: process.env.API_PATH ||'/api/v1/', // Base path (optional)
    schemes:['http',],
    securityDefinitions: {
        BearerAuth: {
            type: 'apiKey', //apiKey
            name: 'Authorization', //
            scheme: 'bearer',
            bearerFormat: 'JWT',
            in: 'header'
        }
    }
}
