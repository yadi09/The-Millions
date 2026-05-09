import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerConfig from '../config/swagger.config.js';

const router = Router();

// Generate Swagger spec
const swaggerSpec = swaggerJsdoc(swaggerConfig);

// Serve Swagger UI
router.get('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Optional: Serve the Swagger JSON spec
router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

export default router;