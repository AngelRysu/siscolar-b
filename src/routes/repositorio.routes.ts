import { Router } from 'express';
import { RepositorioController } from '../controllers/repositorio.controller';

const router = Router();

// Único endpoint: validar la conexión técnica con Google Drive
router.post('/:id/validar-conexion', RepositorioController.validarConexion);

export default router;
