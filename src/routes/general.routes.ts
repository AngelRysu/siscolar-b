import { Router } from 'express';
import { GeneralController } from '../controllers/general.controller';

const router = Router();

// Endpoint base de verificación
router.get('/', GeneralController.getStatus);

// Endpoint de ítems de ejemplo
router.get('/items', GeneralController.getItems);

export default router;
