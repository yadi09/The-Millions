// backend/src/modules/services/services.service.ts
import { prisma } from "../../lib/prisma.js";

export async function getAllServices() {
  return prisma.service.findMany({
    select: {
      id: true,
      name: true,
      description: true
    }
  });
}

export async function createService(name: string, description?: string) {
  return prisma.service.create({
    data: {
      name,
      ...(description !== undefined && { description }),
    },
  });
}

export async function getServiceById(id: string) {
  // Do not include ContactMessage here. Messages contain PII (name, email,
  // phone) and have their own authenticated endpoint at
  // /api/admin/contact-messages.
  return prisma.service.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      description: true,
      createdAt: true,
      updatedAt: true,
    },
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