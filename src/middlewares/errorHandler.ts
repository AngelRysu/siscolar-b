import type { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  let statusCode = 500;
  let message = 'Error interno del servidor';

  if (err instanceof Error) {
    message = err.message;
    if ('statusCode' in err) {
      statusCode = (err as AppError).statusCode;
    }
  }

  if (err instanceof Error && 'code' in err && (err as { code: string }).code === 'P1001') {
    statusCode = 500;
    message = 'No se pudo conectar a la base de datos';
  }
  
  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message
  });
};