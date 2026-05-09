import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Query validation for GET /api/admin/sidebar
const sidebarQuerySchema = z.object({
  // No query params needed for now, but keeping structure for future extensions
});

export async function getAdminSidebar(req: Request, res: Response) {
  try {
    // Fetch all sidebar items with their children
    const sidebarItems = await prisma.sidebarItem.findMany({
      where: {
        parentId: null, // Only top-level items
      },
      include: {
        children: {
          orderBy: {
            order: 'asc',
          },
        },
      },
      orderBy: {
        order: 'asc',
      },
    });

    // Transform to match expected format and filter by user roles
    // In a real implementation, we would check the user's roles here
    // For now, we'll return all items and let frontend handle role-based visibility
    const data = sidebarItems.map(item => ({
      id: item.id,
      label: item.label,
      icon: item.icon,
      route: item.route,
      roles: item.roles as string[], // Parse JSON to string array
      order: item.order,
      children: item.children.map(child => ({
        id: child.id,
        label: child.label,
        icon: child.icon,
        route: child.route,
        roles: child.roles as string[],
        order: child.order,
      })).sort((a, b) => a.order - b.order),
    })).sort((a, b) => a.order - b.order);

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching admin sidebar:', error);
    // Hide raw error in production
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}