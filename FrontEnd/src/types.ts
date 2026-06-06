export interface Section {
  id: string;
  type: string;
  order: number;  
  content: Record<string, unknown>;
  pageId?: string;
}

export interface Page {
    id: string;
    slug: string;
    title?: string;
    sections: Section[];
    createdAt?: string;
    updatedAt?: string;
}

export interface UpdatePageRequest {
    id: string;
    data: {
        title?: string;
        sections: Section[];
    };
}
