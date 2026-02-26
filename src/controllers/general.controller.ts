import { Request, Response } from 'express';
import { buildSuccessResponse, buildErrorResponse, buildPaginatedResponse } from '../utils/responseBuilder';

export class GeneralController {
  /**
   * Verifica el estado de la API.
   */
  static getStatus(req: Request, res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';
    res.status(200).json(buildSuccessResponse({
      message: 'API v1 funcionando correctamente',
      environment: isProduction ? 'Production' : 'Development'
    }));
  }

  /**
   * Ejemplo de listado paginado.
   */
  static async getItems(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const pageSize = parseInt(req.query.pageSize as string) || 10;

      if (page < 1 || pageSize < 1) {
        return res.status(400).json(buildErrorResponse(
          "INVALID_PARAMETERS",
          "Los parámetros 'page' y 'pageSize' deben ser números positivos."
        ));
      }

      // Simulación de datos
      const allItems = Array.from({ length: 50 }, (_, i) => ({ id: i + 1, name: `Item ${i + 1}` }));
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const items = allItems.slice(startIndex, endIndex);
      const totalItems = allItems.length;

      res.status(200).json(buildPaginatedResponse(items, totalItems, page, pageSize));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      res.status(500).json(buildErrorResponse("INTERNAL_SERVER_ERROR", errorMessage));
    }
  }
}
