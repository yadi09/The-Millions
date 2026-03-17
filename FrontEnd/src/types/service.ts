export interface SubService {
    id: string;
    title: string;
    description: string;
    items: string[];
}

export interface Service {
    id: string;
    icon: string;
    title: string;
    description: string;
    features: string[];
    order: number;
    subServices: SubService[];
}
