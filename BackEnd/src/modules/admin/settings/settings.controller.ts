import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAdminSettings(
  req: Request,
  res: Response,
) {
  try {
    const settings = await prisma.setting.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const groupedSettings: Record<string, any[]> = {};

    settings.forEach((setting) => {
      if (!groupedSettings[setting.group]) {
        groupedSettings[setting.group] = [];
      }

      groupedSettings[setting.group].push({
        id: setting.id,
        key: setting.key,
        value: setting.value,
        type: setting.type,
        updatedAt: setting.updatedAt,
      });
    });

    return res.status(200).json(groupedSettings);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function updateAdminSetting(
  req: Request,
  res: Response,
) {
  try {
    const rawKey = req.params.key;

    const key =
      typeof rawKey === 'string'
        ? rawKey
        : Array.isArray(rawKey)
        ? rawKey[0]
        : undefined;

    if (!key) {
      return res.status(400).json({
        message: 'Invalid key',
      });
    }

    const value = req.body.value;

    const type =
      typeof req.body.type === 'string'
        ? req.body.type
        : undefined;

    if (!type) {
      return res.status(400).json({
        message: 'type is required',
      });
    }

    const validTypes = [
      'string',
      'number',
      'boolean',
      'object',
    ];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `type must be one of: ${validTypes.join(', ')}`,
      });
    }

    const existingSetting =
      await prisma.setting.findUnique({
        where: {
          key,
        },
      });

    if (!existingSetting) {
      return res.status(404).json({
        message: 'Setting not found',
      });
    }

    const updatedSetting =
      await prisma.setting.update({
        where: {
          key,
        },

        data: {
          value: value as Prisma.InputJsonValue,
          type,
        },
      });

    return res.status(200).json(updatedSetting);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}