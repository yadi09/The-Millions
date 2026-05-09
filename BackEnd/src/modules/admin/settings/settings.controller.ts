import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Query validation for GET /api/admin/settings
const settingsQuerySchema = z.object({
  // No query params needed for now, but keeping structure for future extensions
});

// Body validation for PUT /api/admin/settings/:key
const settingUpdateSchema = z.object({
  value: z.unknown(), // Accept any JSON value
  type: z.enum(['string', 'number', 'boolean', 'object']),
});

export async function getAdminSettings(req: Request, res: Response) {
  try {
    // Fetch all settings
    const settings = await prisma.setting.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Group settings by category
    const groupedSettings: Record<string, any[]> = {};
    
    settings.forEach(setting => {
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

    res.status(200).json(groupedSettings);
  } catch (error: any) {
    console.error('Error fetching admin settings:', error);
    // Hide raw error in production
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}

export async function updateAdminSetting(req: Request, res: Response) {
  try {
    const { key } = req.params;
    
    // Validate request body
    const validation = settingUpdateSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: 'Invalid request body',
        errors: validation.error.format(),
      });
    }

    const { value, type } = validation.data;

    // Check if setting exists
    const existingSetting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!existingSetting) {
      return res.status(404).json({ message: 'Setting not found' });
    }

    // Update the setting
    const updatedSetting = await prisma.setting.update({
      where: { key },
      data: {
        value,
        type,
      },
    });

    res.status(200).json({
      id: updatedSetting.id,
      key: updatedSetting.key,
      value: updatedSetting.value,
      type: updatedSetting.type,
      group: updatedSetting.group,
      updatedAt: updatedSetting.updatedAt,
    });
  } catch (error: any) {
    console.error('Error updating admin setting:', error);
    // Hide raw error in production
    if (process.env.NODE_ENV === 'production') {
      res.status(500).json({ message: 'Internal server error' });
    } else {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  }
}