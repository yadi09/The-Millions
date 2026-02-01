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

    return prisma.$transaction(async (tx) => {  // ✅ Remove manual type annotation
        // Update Page details
        const page = await tx.page.update({
            where: { id },
            data: {
                slug,
                title,
            },
        });

        // If sections are provided, replace them
        if (sections) {
            await tx.section.deleteMany({
                where: { pageId: id },
            });

            await tx.section.createMany({
                data: sections.map((s) => ({ ...s, pageId: id })),
            });
        }

        return tx.page.findUnique({
            where: { id },
            include: {
                sections: {
                    orderBy: { order: "asc" },  // ✅ Prisma will infer correct type
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