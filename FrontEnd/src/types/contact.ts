export type ContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'PENDING_REVIEW';

export type ContactSource = 'WEB_FORM' | 'AI_AGENT' | 'MANUAL';

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  // Optional: AI-agent-collected leads may have no associated service
  // (the agent knows the category as text, not the UUID).
  service?: {
    id: string;
    name: string;
  };
  status: ContactStatus;
  source?: ContactSource;
  metadata?: Record<string, unknown> | null;
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
