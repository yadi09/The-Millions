// backend/src/modules/services/services.routes.ts
import { Router } from 'express';
import { 
  getServices, 
  createServiceController, 
  getServiceByIdController, 
  updateServiceController, 
  deleteServiceController 
} from './services.controller.js';

const router = Router();

router.get('/', getServices);
router.post('/', createServiceController);
router.get('/:id', getServiceByIdController);
router.put('/:id', updateServiceController);
router.delete('/:id', deleteServiceController);

export default router;