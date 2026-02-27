import { google } from 'googleapis';
import prisma from '../config/db';
import { AppError } from '../middlewares/errorHandler';
import path from 'path';

export class GoogleDriveService {
  /**
   * Obtiene un cliente autenticado usando una Cuenta de Servicio.
   */
  private static getAuthClient() {
    const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_PATH;

    if (!keyPath) {
      throw new AppError('Configuración de Google Service Account no encontrada en el entorno.', 500);
    }

    const absoluteKeyPath = path.isAbsolute(keyPath) 
      ? keyPath 
      : path.join(process.cwd(), keyPath);

    return new google.auth.GoogleAuth({
      keyFile: absoluteKeyPath,
      scopes: ['https://www.googleapis.com/auth/drive'],
    });
  }

  /**
   * Valida la conexión con Google Drive y verifica permisos sobre la carpeta raíz.
   */
  static async validateConnection(repositorioId: number) {
    const repo = await prisma.repositorio.findUnique({
      where: { id: repositorioId },
    });

    if (!repo) {
      throw new AppError('Repositorio no encontrado.', 404);
    }

    try {
      const auth = this.getAuthClient();
      const drive = google.drive({ version: 'v3', auth });

      const response = await drive.files.get({
        fileId: repo.carpeta_id,
        fields: 'id, name, capabilities, driveId',
        supportsAllDrives: true,
      });

      const data = response.data;

      return {
        repositorioId: repo.id,
        driveId: data.driveId || repo.drive_id || 'root',
        carpetaRaizId: data.id || repo.carpeta_id,
        acceso: 'Ok',
        permisos: {
          puedeListar: data.capabilities?.canListChildren || false,
          puedeCrearCarpetas: data.capabilities?.canAddChildren || false,
        },
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new AppError(`Error de acceso a Google Drive (Service Account): ${error.message}`, 403);
    }
  }
}
