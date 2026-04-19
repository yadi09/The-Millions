// backend/src/modules/services/services.controller.ts
import { Request, Response } from 'express';
import { 
  getAllServices, 
  createService, 
  getServiceById, 
  updateService, 
  deleteService 
} from './services.service.js';

export const getServices = async (req: Request, res: Response): Promise<void> => {
  try {
    const services = await getAllServices();
    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const createServiceController = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description } = req.body;
    
    if (!name || !description) {
      res.status(400).json({ error: 'Name and description are required' });
      return;
    }
    
    const service = await createService(name, description);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const getServiceByIdController = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ FIX: Handle possible array type for id
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'Service ID is required' });
      return;
    }
    
    const service = await getServiceById(id);
    
    if (!service) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

export const updateServiceController = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ FIX: Handle possible array type for id
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'Service ID is required' });
      return;
    }
    
    const { name, description } = req.body;
    
    const service = await updateService(id, name, description);
    res.status(200).json(service);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteServiceController = async (req: Request, res: Response): Promise<void> => {
  try {
    // ✅ FIX: Handle possible array type for id
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    
    if (!id) {
      res.status(400).json({ error: 'Service ID is required' });
      return;
    }
    
    await deleteService(id);
    res.status(200).json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};