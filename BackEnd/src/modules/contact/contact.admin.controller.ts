import { Request, Response } from 'express';
import { PrismaClient, ContactStatus } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Query validation for GET /api/admin/contact-messages
const querySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('20'),
  status: z.nativeEnum(ContactStatus).optional(),
  search: z.string().optional(),
});

// Body validation for PUT /api/admin/contact-messages/:id/status
const statusUpdateSchema = z.object({
  status: z.nativeEnum(ContactStatus),
});

export async function getContactMessages(req: Request, res: Response) {
  try {
    // Validate query parameters
    const validation = querySchema.safeParse(req.query);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Invalid query parameters',
        errors: validation.error.format(),
      });
    }

    const { page, limit, status, search } = validation.data;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }
    if (search) {
      whereClause.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.contactMessage.count({ where: whereClause });

    // Fetch messages with related service data
    const messages = await prisma.contactMessage.findMany({
      where: whereClause,
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limitNum,
    });

    // Transform to match expected output format
    const data = messages.map((msg) => ({
      id: msg.id,
      fullName: msg.fullName,
      email: msg.email,
      phone: msg.phone ?? undefined,
      message: msg.message,
      service: {
        id: msg.service.id,
        name: msg.service.name,
      },
      status: msg.status,
      createdAt: msg.createdAt,
    }));

    const totalPages = Math.ceil(total / limitNum);

    res.status(200).json({
      data,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
      },
    });
  } catch (error: any) {
    console.error('Error fetching contact messages:', error);
    // Hide raw error in production
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export async function updateContactMessageStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    // Validate request body
    const validation = statusUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Invalid request body',
        errors: validation.error.format(),
      });
    }

    const { status } = validation.data;

    // Check if contact message exists
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id },
    });

    if (!existingMessage) {
      return res.status(404).json({ message: 'Contact message not found' });
    }

    // Update the status
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { status },
      include: {
        service: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(200).json({
      id: updatedMessage.id,
      fullName: updatedMessage.fullName,
      email: updatedMessage.email,
      phone: updatedMessage.phone ?? undefined,
      message: updatedMessage.message,
      service: {
        id: updatedMessage.service.id,
        name: updatedMessage.service.name,
      },
      status: updatedMessage.status,
      createdAt: updatedMessage.createdAt,
    });
  } catch (error: any) {
    console.error('Error updating contact message status:', error);
    // Hide raw error in production
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}