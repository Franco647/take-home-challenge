import { Request, Response } from 'express';
import { PoliciesService } from './policies.service.js';
import { OperationsRepository } from '../operations/operations.repository.js';

export class PoliciesController {
    private service = new PoliciesService();
    private opsRepo = new OperationsRepository();

    uploadCSV = async (req: Request, res: Response) => {
        const correlationId = (req.headers['x-correlation-id'] as string);
        
        const operation = await this.opsRepo.createOperation({
            correlation_id: correlationId,
            endpoint: '/upload'
        });

        try {
            if (!req.file) throw new Error('CSV file is required');
            const result = await this.service.processCSV(req.file.buffer, operation.id, correlationId);

            res.status(200).json({
                data: {
                    operation_id: operation.id,
                    correlation_id: correlationId,
                    ...result
                }
            });
        } catch (error: any) {
            await this.opsRepo.updateOperation(operation.id, {
                status: 'FAILED',
                error_summary: error.message
            });

            res.status(400).json({
                message: error.message || 'Error processing CSV',
                correlation_id: correlationId
            });
        }
    };

    getAll = async (req: Request, res: Response) => {
        try {
            const limit = Math.min(Number(req.query.limit) || 25, 100);
            const offset = Number(req.query.offset) || 0;

            const filters = {
                limit,
                offset,
                status: req.query.status as string,
                policy_type: req.query.policy_type as string,
                q: req.query.q as string
            };

            const { items, total } = await this.service.findAll(filters);

            res.status(200).json({
                data: {
                    items,
                    pagination: { limit, offset, total }
                }
            });
        } catch (error: any) {
            res.status(500).json({
                message: error.message || 'Internal server error'
            });
        }
    };

    getSummary = async (_req: Request, res: Response) => {
        try {
            const summary = await this.service.getSummary();
            res.status(200).json({
                data: summary
            });
        } catch (error: any) {
            res.status(500).json({ 
                message: error.message || 'Internal server error' 
            });
        }
    };
}