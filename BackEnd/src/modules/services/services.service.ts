// backend/src/modules/services/services.service.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getAllServices() {
  return prisma.service.findMany({
    select: {
      id: true,
      name: true,
      description: true
    }
  });
}

export async function createService(name: string, description: string) {
  return prisma.service.create({
    data: {
      name,
      description
    }
  });
}

export async function getServiceById(id: string) {
  return prisma.service.findUnique({
    where: { id },
    include: {
      messages: true
    }
  });
}

export async function updateService(id: string, name?: string, description?: string) {
  return prisma.service.update({
    where: { id },
    data: {
      name,
      description
    }
  });
}

export async function deleteService(id: string) {
  return prisma.service.delete({
    where: { id }
  });
}