import { Request, Response } from 'express';
import { getGlobalFooter, updateGlobalFooter } from './footer.service.js';

// Defaults mirror FrontEnd/src/data/landingContent.ts so the empty-DB fallback
// produces the same UI as the frontend's offline default.
const DEFAULTS = {
  contactLabel: "Get In Touch",
  contactTitle: "Ready to Work Together?",
  contactSubTitle:
    "Reach out to discuss how The MILLIONS can support your organisation, your team, or your ambitions.",
  buttonText: "Send Us a Message",
  logoText: "the MILLIONS.",
  location: "Southampton, United Kingdom",
  copyright: "The MILLIONS. Setting You Up For Success. All rights reserved.",
  websiteUrl: "www.themillions.co.uk",
};

export async function getFooter(_req: Request, res: Response) {
  try {
    const footer = await getGlobalFooter();

    if (!footer) {
      return res.json({
        contact: {
          label: DEFAULTS.contactLabel,
          title: DEFAULTS.contactTitle,
          subTitle: DEFAULTS.contactSubTitle,
          phones: [],
          email: "",
          website: DEFAULTS.websiteUrl,
          address: [],
          whatsapp: "",
          buttonText: DEFAULTS.buttonText,
        },
        footer: {
          logo: DEFAULTS.logoText,
          copyright: DEFAULTS.copyright,
          location: DEFAULTS.location,
        },
        showContactBlock: true,
      });
    }

    res.json({
      contact: {
        label: footer.contactLabel ?? DEFAULTS.contactLabel,
        title: footer.contactTitle ?? DEFAULTS.contactTitle,
        subTitle: footer.contactSubTitle ?? DEFAULTS.contactSubTitle,
        phones: footer.phone,
        email: footer.email,
        website: footer.websiteUrl ?? DEFAULTS.websiteUrl,
        address: footer.address,
        whatsapp: (footer.socialMedia as any)?.whatsapp || "",
        buttonText: footer.buttonText ?? DEFAULTS.buttonText,
      },
      footer: {
        logo: footer.logoText ?? DEFAULTS.logoText,
        copyright: footer.copyright,
        location: footer.location ?? DEFAULTS.location,
      },
      showContactBlock: footer.showContactBlock,
    });
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