import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const servicesService = {
    getAllServices: async () => {
        return prisma.service.findMany({
            orderBy: { createdAt: 'desc' },
        });
    },

    createService: async (name: string) => {
        return prisma.service.create({
            data: { name },
        });
    },
};
