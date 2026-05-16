import { prisma } from "../../lib/prisma.js";

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
