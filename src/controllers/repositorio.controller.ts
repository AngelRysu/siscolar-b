import { Request, Response, NextFunction } from 'express';
import { GoogleDriveService } from '../services/googleDrive.service';
import { buildSuccessResponse } from '../utils/responseBuilder';
import { AppError } from '../middlewares/errorHandler';
import prisma from '../config/db';

export class RepositorioController {
  static async crear(req: Request, res: Response, next: NextFunction) {
    try {
      const { unidad_id, proveedor, drive_id, carpeta_id, nombre } = req.body;
      if (!proveedor || !drive_id || !carpeta_id || !nombre) {
        throw new AppError('Faltan campos obligatorios para crear el repositorio.', 400);
      }

      const nuevoRepositorio = await prisma.repositorio.create({
        data: {
          unidad_id: unidad_id ? parseInt(unidad_id) : null,
          proveedor,
          drive_id,
          carpeta_id,
          nombre,
          estado: 'Activo'
        }
      });

      res.status(201).json(buildSuccessResponse(nuevoRepositorio));
    } catch (error) {
      next(error);
    }
  }

  static async listar(req: Request, res: Response, next: NextFunction) {
    try {
      const repositorios = await prisma.repositorio.findMany();
      res.status(200).json(buildSuccessResponse(repositorios));
    } catch (error) {
      next(error);
    }
  }

  static async obtenerPorClave(req: Request, res: Response, next: NextFunction) {
    try {
      const { clave } = req.params;

      if (typeof clave !== 'string') {
        throw new AppError('La clave de la unidad es requerida y debe ser un texto.', 400);
      }

      // 1. Buscar la unidad académica por su clave para obtener el ID numérico
      const unidad = await prisma.unidades.findUnique({
        where: { clave }
      });

      if (!unidad) {
        throw new AppError(`No se encontró una unidad académica con la clave: ${clave}`, 404);
      }

      // 2. Buscar los repositorios asociados a ese ID de unidad
      const repositorios = await prisma.repositorio.findMany({
        where: { unidad_id: unidad.id_unidad }
      });

      if (!repositorios || repositorios.length === 0) {
        throw new AppError(`No existen repositorios configurados para la unidad con clave: ${clave}`, 404);
      }

      res.status(200).json(buildSuccessResponse(repositorios));
    } catch (error) {
      next(error);
    }
  }

  static async actualizar(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (typeof id !== 'string') {
        throw new AppError('ID de repositorio inválido.', 400);
      }

      const repositorioId = parseInt(id);
      
      if (isNaN(repositorioId)) {
        throw new AppError('ID de repositorio inválido.', 400);
      }

      const { unidad_id, proveedor, drive_id, carpeta_id, nombre } = req.body;

      const updateData: any = {
        proveedor,
        drive_id,
        carpeta_id,
        nombre
      };

      if (unidad_id !== undefined) {
        updateData.unidad_id = unidad_id ? parseInt(unidad_id) : null;
      }

      const repositorioActualizado = await prisma.repositorio.update({
        where: { id: repositorioId },
        data: updateData
      });

      res.status(200).json(buildSuccessResponse(repositorioActualizado));
    } catch (error) {
      next(error);
    }
  }

  static async actualizarEstado(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      if (typeof id !== 'string') {
        throw new AppError('ID de repositorio inválido.', 400);
      }

      const repositorioId = parseInt(id);

      if (isNaN(repositorioId)) {
        throw new AppError('ID de repositorio inválido.', 400);
      }

      if (!estado) {
        throw new AppError('El campo estado es requerido.', 400);
      }

      const repositorioActualizado = await prisma.repositorio.update({
        where: { id: repositorioId },
        data: { estado }
      });

      res.status(200).json(buildSuccessResponse(repositorioActualizado));
    } catch (error) {
      next(error);
    }
  }

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
