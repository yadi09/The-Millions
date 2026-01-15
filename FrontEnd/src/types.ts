export interface Section {
    id: string;
    type: string;
    content: Record<string, any>;
    pageId?: string;
}

export interface Page {
    id: string;
    slug: string;
    title?: string;
    name?: string;
    description?: string;
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
