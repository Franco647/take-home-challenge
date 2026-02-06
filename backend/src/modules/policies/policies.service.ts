import { parse } from 'csv-parse/sync';
import { RuleEngine } from './domain/rule.engine.js';
import { PropertyMinInsuredValueRule } from './domain/rules/property-value.rule.js';
import { AutoMinInsuredValueRule } from './domain/rules/auto-value.rule.js';
import { PoliciesRepository } from './policies.repository.js';

export class PoliciesService {
    private engine: RuleEngine;
    private repository: PoliciesRepository;

    constructor() {
        this.repository = new PoliciesRepository();
        this.engine = new RuleEngine([
            new PropertyMinInsuredValueRule(),
            new AutoMinInsuredValueRule()
        ]);
    }

    async processCSV(buffer: Buffer, opId: string, correlationId: string) {
        const startTime = Date.now();

        const records = parse(buffer, {
            columns: true,
            skip_empty_lines: true,
            trim: true
        });

        const validRows: any[] = [];
        const errors: any[] = [];

        records.forEach((row: any, index: number) => {
            const techError = this.validateTechnical(row);
            const businessErrors = this.engine.execute(row);
            const allErrors = techError ? [techError, ...businessErrors] : businessErrors;

            if (allErrors.length > 0) {
                errors.push({
                    row_number: index + 1,
                    field: allErrors[0].field,
                    code: allErrors[0].code,
                    message: allErrors[0].message
                });
            } else {
                validRows.push({
                    policy_number: row.policy_number,
                    customer: row.customer,
                    policy_type: row.policy_type,
                    start_date: new Date(row.start_date),
                    end_date: new Date(row.end_date),
                    premium_usd: parseFloat(row.premium_usd),
                    status: row.status,
                    insured_value_usd: parseFloat(row.insured_value_usd)
                });
            }
        });

        if (validRows.length > 0) {
            await this.repository.saveBatch(validRows);
        }

        const duration = Date.now() - startTime;

        console.log(JSON.stringify({
            type: 'BUSINESS_METRIC',
            operation_id: opId,
            correlation_id: correlationId,
            action: 'upload_csv',
            inserted: validRows.length,
            rejected: errors.length,
            duration_ms: duration
        }));

        await this.repository.updateOperation(opId, {
            status: 'COMPLETED',
            rows_inserted: validRows.length,
            rows_rejected: errors.length,
            duration_ms: duration
        });

        return {
            inserted_count: validRows.length,
            rejected_count: errors.length,
            errors
        };
    }

    async findAll(params: any) {
        return this.repository.findMany(params);
    }

    async getSummary() {
        return this.repository.getSummary();
    }

    private validateTechnical(row: any) {
        if (!row.policy_number) return { field: 'policy_number', code: 'REQUIRED', message: 'El número de póliza es obligatorio' };

        const start = new Date(row.start_date);
        const end = new Date(row.end_date);

        if (isNaN(start.getTime()) || isNaN(end.getTime())) return { field: 'date', code: 'INVALID_FORMAT', message: 'Formato de fecha inválido' };
        if (start >= end) return { field: 'start_date', code: 'INVALID_DATES', message: 'La fecha de inicio debe ser anterior a la de fin' };

        const validStatus = ['active', 'expired', 'cancelled'];
        if (!validStatus.includes(row.status)) return { field: 'status', code: 'INVALID_STATUS', message: 'El estado no es válido (active, expired, cancelled)' };

        return null;
    }
}