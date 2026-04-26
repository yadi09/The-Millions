import { Request, Response } from 'express';
import { getGlobalFooter, updateGlobalFooter } from './footer.service.js';

export async function getFooter(req: Request, res: Response) {
  try {
    const footer = await getGlobalFooter();
    
    if (!footer) {
      return res.status(404).json({ error: 'Footer not found' });
    }

    // Transform response to match frontend FooterData interface
    const response = {
      contact: {
        label: "Ready to Start Your Journey?",
        title: "Let's Build Something Great Together",
        subTitle: "Our expert team is here to provide the professional advisory and learning services you need to succeed in global markets.",
        phones: footer.phone.split(',').map(p => p.trim()),
        email: footer.email,
        website: "www.themillions.com",
        address: footer.address.split(',').map(a => a.trim()),
        whatsapp: (footer.socialMedia as any)?.whatsapp || "",
        buttonText: "WhatsApp Us"
      },
      footer: {
        logo: "/logo.svg",
        copyright: footer.copyright,
        location: "London / Global"
      },
      showContactBlock: footer.showContactBlock
    };
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching global footer:', error);
    res.status(500).json({ error: 'Failed to fetch global footer' });
  }
}

export async function updateFooterController(req: Request, res: Response) {
  try {
    const footerData = req.body;
    const updatedFooter = await updateGlobalFooter(footerData);
    res.json(updatedFooter);
  } catch (error) {
    console.error('Error updating global footer:', error);
    res.status(500).json({ error: 'Failed to update global footer' });
  }
}