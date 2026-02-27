import { Router } from 'express';
import { RepositorioController } from '../controllers/repositorio.controller';

const router = Router();

router.post('/', RepositorioController.crear);
router.get('/', RepositorioController.listar);
router.get('/clave/:clave', RepositorioController.obtenerPorClave);
router.patch('/:id', RepositorioController.actualizar);
router.patch('/:id/estado', RepositorioController.actualizarEstado);

router.post('/:id/validar-conexion', RepositorioController.validarConexion);

export default router;
