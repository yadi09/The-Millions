import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export async function createPage(data: {
    slug: string;
    title: string;
    sections?: { type: string; order: number; content: any }[];
}) {
    const { slug, title, sections = [] } = data;

    return prisma.page.create({
        data: {
            slug,
            title,
            sections: {
                create: sections,
            },
        },
        include: {
            sections: true,
        },
    });
}

export async function updatePage(
    id: string,
    data: {
        slug?: string;
        title?: string;
        sections?: { type: string; order: number; content: any }[];
    }
) {
    const { slug, title, sections } = data;

    return prisma.$transaction(async (tx) => {
        // Update Page details
        const page = await tx.page.update({
            where: { id },
            data: {
                slug,
                title,
            },
        });

        // If sections are provided, replace them
        if (sections !== undefined) {
            await tx.section.deleteMany({
                where: { pageId: id },
            });

            if (sections.length > 0) {
                await tx.section.createMany({
                    data: sections.map(section => ({
                        type: section.type,
                        order: section.order,
                        content: section.content,
                        pageId: id,
                    })),
                });
            }
        }

        return tx.page.findUnique({
            where: { id },
            include: {
                sections: {
                    orderBy: { order: "asc" },
                },
            },
        });
    });
}

export async function deletePage(id: string) {
    return prisma.page.delete({
        where: { id },
    });
}