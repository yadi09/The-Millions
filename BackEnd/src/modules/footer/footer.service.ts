// backend/src/modules/footer/footer.service.ts
import { PrismaClient } from "@prisma/client";

// ✅ CORRECT PRISMA CLIENT INITIALIZATION FOR V6
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function getFooterByPage(slug: string) {
  return prisma.page.findUnique({
    where: { slug },
    include: {
      footer: true
    }
  });
}

// ✅ FIXED FUNCTION SIGNATURE AND VARIABLE DEFINITION
export async function updateFooter(slug: string, data: any) {
  // First find the page to get its ID
  const page = await prisma.page.findUnique({
    where: { slug },
    select: { id: true }
  });

  if (!page) {
    throw new Error("Page not found");
  }

  // Update or create footer
  return prisma.footer.upsert({
    where: { pageId: page.id },
    update: data,
    create: {
      ...data,
      pageId: page.id
    }
  });
}