import { prisma } from "../../lib/prisma.js";

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
        sections?: { type: string; order: number; content: any; visible?: boolean }[];
    }
) {
    const { slug, title, sections } = data;

    return prisma.$transaction(async (tx) => {
        // Update Page details
        await tx.page.update({
            where: { id },
            data: {
                slug,
                title,
            },
        });

        // If sections are provided, replace them. Snapshot current visibility
        // by section type BEFORE deleting so the brothers' on/off toggles
        // aren't clobbered every time they hit Save in the editor — section
        // types are unique-per-page in practice (hero, services, etc.), so a
        // type→visible map is a reliable carry-over key.
        if (sections !== undefined) {
            const existing = await tx.section.findMany({
                where: { pageId: id },
                select: { type: true, visible: true },
            });
            const visibilityByType = new Map(existing.map((s) => [s.type, s.visible]));

            await tx.section.deleteMany({
                where: { pageId: id },
            });

            if (sections.length > 0) {
                await tx.section.createMany({
                    data: sections.map(section => ({
                        type: section.type,
                        order: section.order,
                        content: section.content,
                        // Prefer explicit value from the request, fall back to
                        // the carry-over snapshot, default to visible.
                        visible: section.visible ?? visibilityByType.get(section.type) ?? true,
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