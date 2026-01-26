import { Request, Response } from 'express';
import { servicesService } from './services.service.js';

export const getServices = async (req: Request, res: Response): Promise<void> => {
    try {
        const services = await servicesService.getAllServices();
        res.status(200).json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
};

export const createService = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name } = req.body;
        if (!name) {
            res.status(400).json({ error: 'Name is required' });
            return;
        }
        const service = await servicesService.createService(name);
        res.status(201).json(service);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create service' });
    }
};
