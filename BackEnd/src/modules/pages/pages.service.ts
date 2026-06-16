import { prisma } from "../../lib/prisma.js";

// Fetch a page by slug. Public callers get only visible sections; admin
// callers (or preview mode) pass `includeHidden=true` to receive all
// sections including the ones currently toggled off.
export async function getPageBySlug(slug: string, opts: { includeHidden?: boolean } = {}) {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      sections: {
        where: opts.includeHidden ? undefined : { visible: true },
        orderBy: { order: "asc" }
      }
    }
  });
}
