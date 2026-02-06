import { Request, Response, NextFunction } from 'express';

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const correlationId = req.headers['x-correlation-id'];
  
  console.error(`[INTERNAL_ERROR] CID: ${correlationId} - ${err.stack || err.message}`);

  res.status(err.status || 500).json({
    message: err.message || 'Ocurrió un error inesperado en el servidor',
    correlation_id: correlationId
  });
};