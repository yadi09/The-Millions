import { Request, Response } from 'express';
import { contactService } from './contact.service.js';

export const submitContactForm = async (req: Request, res: Response): Promise<void> => {
    try {
        const { fullName, email, phone, message, serviceId } = req.body;

        // Basic Validation
        if (!fullName || !email || !message || !serviceId) {
            res.status(400).json({ error: 'Missing required fields: fullName, email, message, serviceId are required' });
            return;
        }

        const newMessage = await contactService.createMessage({
            fullName,
            email,
            phone,
            message,
            serviceId,
        });

        res.status(201).json({ message: 'Message sent successfully', data: newMessage });
    } catch (error) {
        console.error('Error submitting contact form:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};
