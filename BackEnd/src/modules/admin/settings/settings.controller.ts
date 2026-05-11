import { Request, Response } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAdminSettings(req: Request, res: Response) {
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
  } catch (error: any) {
    console.error('Error fetching settings:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

export async function updateAdminSetting(req: Request, res: Response) {
  try {
    const key =
      typeof req.params.key === 'string'
        ? req.params.key
        : req.params.key?.[0];

    if (!key) {
      return res.status(400).json({
        message: 'Invalid key',
      });
    }

    const value = req.body.value;
    const type = req.body.type;

    if (typeof type !== 'string') {
      return res.status(400).json({
        message: 'type must be a string',
      });
    }

    const validTypes = ['string', 'number', 'boolean', 'object'];

    if (!validTypes.includes(type)) {
      return res.status(400).json({
        message: `type must be one of: ${validTypes.join(', ')}`,
      });
    }

    const existingSetting = await prisma.setting.findUnique({
      where: {
        key,
      },
    });

    if (!existingSetting) {
      return res.status(404).json({
        message: 'Setting not found',
      });
    }

    const updatedSetting = await prisma.setting.update({
      where: {
        key,
      },

      data: {
        value: value as Prisma.InputJsonValue,
        type,
      },
    });

    return res.status(200).json({
      id: updatedSetting.id,
      key: updatedSetting.key,
      value: updatedSetting.value,
      type: updatedSetting.type,
      group: updatedSetting.group,
      updatedAt: updatedSetting.updatedAt,
    });
  } catch (error: any) {
    console.error('Error updating setting:', error);

    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}