import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getPageBySlug(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      sections: {
        orderBy: { order: "asc" }
      }
    }
  });
}
