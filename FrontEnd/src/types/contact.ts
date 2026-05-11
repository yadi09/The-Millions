export type ContactStatus = 'NEW' | 'READ' | 'REPLIED';

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  service: {
    id: string;
    name: string;
  };
  status: ContactStatus;
  createdAt: string;
}

export interface GetContactMessagesResponse {
  data: ContactMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
