import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateContactMessageDto {
    fullName: string;
    email: string;
    phone?: string;
    message: string;
    serviceId: string;
}

export const contactService = {
    createMessage: async (data: CreateContactMessageDto) => {
        return prisma.contactMessage.create({
            data,
        });
    },
};
