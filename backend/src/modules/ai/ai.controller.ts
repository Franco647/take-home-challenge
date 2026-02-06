import { Request, Response } from 'express';
import { AIService } from './ai.service.js';

export class AIController {
    private service = new AIService();

    getInsights = async (req: Request, res: Response) => {
        try {

            if (req.method === 'POST' && !req.body) {
                return res.status(400).json({
                    message: 'Request body is missing'
                });
            }

            const filters = req.body.filters || {};
            const result = await this.service.generateInsights(filters);

            res.status(200).json({
                data: result
            });

        } catch (error: any) {
            res.status(500).json({
                message: error.message || 'Error generating AI insights'
            });
        }
    };
}