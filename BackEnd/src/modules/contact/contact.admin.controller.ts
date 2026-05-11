import { Request, Response } from 'express';
import {
  PrismaClient,
  ContactStatus,
  Prisma,
} from '@prisma/client';

const prisma = new PrismaClient();

export async function getContactMessages(
  req: Request,
  res: Response,
) {
  try {
    const page =
      typeof req.query.page === 'string'
        ? req.query.page
        : '1';

    const limit =
      typeof req.query.limit === 'string'
        ? req.query.limit
        : '20';

    const status =
      typeof req.query.status === 'string'
        ? (req.query.status as ContactStatus)
        : undefined;

    const search =
      typeof req.query.search === 'string'
        ? req.query.search
        : undefined;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;

    const skip = (pageNum - 1) * limitNum;

    const whereClause: Prisma.ContactMessageWhereInput = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause.OR = [
        {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          phone: {
            contains: search,
            mode: 'insensitive',
          },
        },

        {
          message: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [messages, total] = await prisma.$transaction([
      prisma.contactMessage.findMany({
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
      }),

      prisma.contactMessage.count({
        where: whereClause,
      }),
    ]);

    const data = (messages as any[]).map((msg) => ({
      id: msg.id,
      fullName: msg.fullName,
      email: msg.email,
      phone: msg.phone ?? undefined,
      message: msg.message,

      service: msg.service
        ? {
            id: msg.service.id,
            name: msg.service.name,
          }
        : undefined,

      status: msg.status,
      createdAt: msg.createdAt,
    }));

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
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

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function updateContactMessageStatus(
  req: Request,
  res: Response,
) {
  try {
    const id =
      typeof req.params.id === 'string'
        ? req.params.id
        : req.params.id?.[0];

    if (!id) {
      return res.status(400).json({
        message: 'Invalid id',
      });
    }

    const status = req.body.status;

    if (
      !status ||
      !Object.values(ContactStatus).includes(status)
    ) {
      return res.status(400).json({
        message: 'Invalid status',
      });
    }

    const existingMessage =
      await prisma.contactMessage.findUnique({
        where: {
          id,
        },
      });

    if (!existingMessage) {
      return res.status(404).json({
        message: 'Contact message not found',
      });
    }

    const updatedMessage =
      await prisma.contactMessage.update({
        where: {
          id,
        },

        data: {
          status,
        },

        include: {
          service: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    const messageWithService = updatedMessage as any;

    return res.status(200).json({
      id: messageWithService.id,
      fullName: messageWithService.fullName,
      email: messageWithService.email,
      phone: messageWithService.phone ?? undefined,
      message: messageWithService.message,

      service: messageWithService.service
        ? {
            id: messageWithService.service.id,
            name: messageWithService.service.name,
          }
        : undefined,

      status: messageWithService.status,
      createdAt: messageWithService.createdAt,
    });
  } catch (error: any) {
    console.error('Error updating contact message:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}