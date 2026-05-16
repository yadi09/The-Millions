import { Request, Response } from 'express';
import { z } from 'zod';
import { prisma } from "../../../lib/prisma.js";

// Query validation for GET /api/admin/dashboard
const dashboardQuerySchema = z.object({
  // No query params needed for now, but keeping structure for future extensions
});

export async function getAdminDashboard(req: Request, res: Response) {
  try {
    // Fetch all widgets
    const widgets = await prisma.widget.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    // Transform to match expected format and filter by user roles
    // In a real implementation, we would check the user's roles from JWT here
    // For now, we'll return all widgets and let frontend handle role-based visibility
    const data = widgets.map(widget => ({
      id: widget.id,
      type: widget.type,
      title: widget.title,
      endpoint: widget.endpoint,
      refreshInterval: widget.refreshInterval,
      roles: widget.roles as string[], // Parse JSON to string array
      order: widget.order,
    }));

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching admin dashboard:', error);
    // Hide raw error in production
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}