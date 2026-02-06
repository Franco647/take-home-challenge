import { prisma } from '../../shared/prisma/prisma.service.js';

export class OperationsRepository {
  async createOperation(data: { correlation_id: string, endpoint: string }) {
    return prisma.operation.create({
      data: {
        ...data,
        status: 'RECEIVED'
      }
    });
  }

  async updateOperation(id: string, data: any) {
    return prisma.operation.update({
      where: { id },
      data
    });
  }
}