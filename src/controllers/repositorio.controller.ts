import { Request, Response, NextFunction } from 'express';
import { GoogleDriveService } from '../services/googleDrive.service';
import { buildSuccessResponse } from '../utils/responseBuilder';
import { AppError } from '../middlewares/errorHandler';

export class RepositorioController {
  /**
   * Valida la conexión técnica con Google Drive para un repositorio específico.
   * POST /api/v1/repositorios/:id/validar-conexion
   */
  static async validarConexion(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const repositorioId = parseInt(id as string);

      if (isNaN(repositorioId)) {
        return next(new AppError('El ID del repositorio debe ser un número válido.', 400));
      }

      const connectionData = await GoogleDriveService.validateConnection(repositorioId);

      res.status(200).json(buildSuccessResponse(connectionData));
    } catch (error) {
      next(error);
    }
  }
}
