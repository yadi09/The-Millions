import { prisma } from "../../lib/prisma.js";
import type { UpsertBusinessCardInput } from "./business-card.validation.js";

export async function getMyCard(userId: string) {
    return prisma.businessCard.findUnique({ where: { userId } });
}

export async function upsertMyCard(userId: string, data: UpsertBusinessCardInput) {
    const address = data.address ?? [];
    return prisma.businessCard.upsert({
        where: { userId },
        create: {
            userId,
            name: data.name,
            title: data.title,
            tagline: data.tagline,
            email: data.email,
            phoneMobile: data.phoneMobile,
            phoneOffice: data.phoneOffice,
            website: data.website,
            address,
            template: data.template,
            showQrCode: data.showQrCode,
        },
        update: {
            name: data.name,
            title: data.title,
            tagline: data.tagline,
            email: data.email,
            phoneMobile: data.phoneMobile,
            phoneOffice: data.phoneOffice,
            website: data.website,
            address,
            template: data.template,
            showQrCode: data.showQrCode,
        },
    });
}
