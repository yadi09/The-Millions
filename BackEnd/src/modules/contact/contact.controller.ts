import { Request, Response } from 'express';
import { contactService } from './contact.service.js';

import { contactSchema } from './contact.validation.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
    try {
        // Validation with Zod
        const validation = contactSchema.safeParse(req.body);
        
        if (!validation.success) {
            res.status(400).json({ 
                error: 'Validation failed', 
                details: validation.error.issues.map((err: any) => ({ field: err.path[0], message: err.message }))
            });
            return;
        }

        const { fullName, email, phone, message, serviceId } = validation.data;

        // Verify serviceId exists
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        });

        if (!service) {
            res.status(404).json({ error: 'Service not found', details: [{ field: 'serviceId', message: 'The selected service does not exist.' }] });
            return;
        }

        const newMessage = await contactService.createMessage({
            fullName,
            email,
            phone,
            message,
            serviceId,
        });

        res.status(201).json({ 
            message: 'Contact message received', 
            id: newMessage.id 
        });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
