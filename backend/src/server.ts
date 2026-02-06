import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import policyRoutes from './modules/policies/policies.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import { connectDb } from './shared/prisma/prisma.service.js';
import { globalErrorHandler } from './shared/middleware/error.middleware.js';
import { requestLogger } from './shared/middleware/logger.middleware.js';

const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  const correlationId = (req.headers['x-correlation-id']) || uuidv4();
  req.headers['x-correlation-id'] = correlationId;
  res.setHeader('x-correlation-id', correlationId);
  next();
});

app.use(requestLogger);
app.use(express.json()); 
app.use(cors());

app.use('/api/policies', policyRoutes);
app.use('/api/ai', aiRoutes);

app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    throw error;
  }
}

start();