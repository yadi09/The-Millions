import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getGlobalFooter() {
  return prisma.footer.findFirst();
}

export async function updateGlobalFooter(data: any) {
  const existing = await prisma.footer.findFirst();
  
  if (existing) {
    return prisma.footer.update({
      where: { id: existing.id },
      data
    });
  } else {
    return prisma.footer.create({
      data
    });
  }
}