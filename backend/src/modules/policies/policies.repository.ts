import { prisma } from '../../shared/prisma/prisma.service.js';

export class PoliciesRepository {

    async saveBatch(policies: any[]) {
        return prisma.policy.createMany({
            data: policies,
            skipDuplicates: true
        });
    }
    

    async updateOperation(id: string, data: { 
        status: string, 
        rows_inserted: number, 
        rows_rejected: number, 
        duration_ms: number 
    }) {
        return prisma.operation.update({
            where: { id },
            data
        });
    }
    
    async findMany(params: {
        limit: number;
        offset: number;
        status?: string;
        policy_type?: string;
        q?: string;
    }) {
        const { limit, offset, status, policy_type, q } = params;

        const where: any = {};
        if (status) where.status = status;
        if (policy_type) where.policy_type = policy_type;
        if (q) {
            where.OR = [
                { policy_number: { contains: q, mode: 'insensitive' } },
                { customer: { contains: q, mode: 'insensitive' } }
            ];
        }

        const [items, total] = await Promise.all([
            prisma.policy.findMany({
                where,
                take: limit,
                skip: offset,
                orderBy: { created_at: 'desc' }
            }),
            prisma.policy.count({ where })
        ]);

        return { items, total };
    }

    async getSummary() {
        const allPolicies = await prisma.policy.findMany();

        const total_policies = allPolicies.length;
        const total_premium_usd = allPolicies.reduce((sum, p) => sum + p.premium_usd, 0);

        const count_by_status = allPolicies.reduce((acc: any, p) => {
            acc[p.status] = (acc[p.status] || 0) + 1;
            return acc;
        }, {});

        const premium_by_type = allPolicies.reduce((acc: any, p) => {
            acc[p.policy_type] = (acc[p.policy_type] || 0) + p.premium_usd;
            return acc;
        }, {});

        return {
            total_policies,
            total_premium_usd,
            count_by_status,
            premium_by_type
        };
    }
}