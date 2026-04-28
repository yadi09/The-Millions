export interface FooterData {
  contact: {
    label: string;
    title: string;
    subTitle: string;
    phones: string[];
    email: string;
    website: string;
    address: string[];
    whatsapp: string;
    buttonText: string;
  };
  footer: {
    logo: string;
    copyright: string;
    location: string;
  };
  showContactBlock?: boolean;
}

export interface PageData {
  id: string;
  slug: string;
  title: string;
  sections: Array<{
    id: string;
    type: string;
    order: number;
    content: any;
  }>;
}
