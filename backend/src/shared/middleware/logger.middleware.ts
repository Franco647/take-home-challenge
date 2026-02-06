import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const correlationId = req.headers['x-correlation-id'] as string;

    res.on('finish', () => {
        const duration = Date.now() - start;
        
        const logPayload = {
            timestamp: new Date().toISOString(),
            correlation_id: correlationId,
            method: req.method,
            endpoint: req.originalUrl,
            status: res.statusCode,
            duration_ms: duration,
            details: res.statusMessage || 'OK'
        };

        console.log(JSON.stringify(logPayload));
    });

    next();
};