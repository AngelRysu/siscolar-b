import express, { type Application, type Request, type Response, Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path'; // Para manejar rutas de archivos
import YAML from 'yamljs'; // Para leer el archivo openapi.yaml
import swaggerUi from 'swagger-ui-express'; // UI de documentación
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { globalErrorHandler, AppError } from './middlewares/errorHandler'; // Importamos AppError para 404
import fs from 'node:fs';
import https from 'node:https';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// 1. Configuración de Prisma
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// 2. Configuración de Swagger
// Cargamos el archivo YAML desde la carpeta docs (subimos un nivel desde src)
const swaggerPath = path.join(__dirname, '../docs/openapi.yaml');
let swaggerDocument;
try {
  swaggerDocument = YAML.load(swaggerPath);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
} catch (error) {
  console.warn('No se pudo cargar el archivo openapi.yaml. La documentación no estará disponible.');
}

// 3. Middlewares Base
app.use(express.json());
app.use(cors());

// 4. Rutas de Documentación
if (swaggerDocument) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.get('/docs/json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocument);
  });
}

// 5. Definición de API v1 (Router)
const apiV1Router = Router();

// Endpoint base de verificación
apiV1Router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'API v1 funcionando correctamente',
    environment: isProduction ? 'Production' : 'Development'
  });
});

// Endpoint de prueba para errores (puedes borrarlo luego)
apiV1Router.get('/test-error', (req: Request, res: Response, next) => {
  next(new AppError('Simulación de error controlado', 400));
});

// Montar el router en /api/v1
app.use('/api/v1', apiV1Router);

// 6. Manejo de Rutas No Encontradas (404)
// Esto debe ir DESPUÉS de las rutas y ANTES del error handler global
app.all('*path', (req: Request, res: Response, next) => {
  next(new AppError(`No se encontró la ruta ${req.originalUrl}`, 404));
});

// 7. Middleware Global de Errores
app.use(globalErrorHandler);

// 8. Validación de Conexión y Arranque del Servidor
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a Base de Datos exitosa');

    if (isProduction) {
      // --- MODO PRODUCCIÓN (HTTPS) ---
      const keyPath = process.env.SSL_KEY_PATH;
      const certPath = process.env.SSL_CERT_PATH;

      if (!keyPath || !certPath || !fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
        throw new Error('Certificados SSL no encontrados en las rutas especificadas del .env');
      }

      const httpsOptions = {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
      };

      https.createServer(httpsOptions, app).listen(PORT, () => {
        console.log(`Servidor Seguro corriendo en https://localhost:${PORT}`);
      });

    } else {
      // --- MODO DESARROLLO (HTTP) ---
      app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
        console.log(`Documentación: http://localhost:${PORT}/docs`);
      });
    }

  } catch (error) {
    console.error('Error fatal al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();