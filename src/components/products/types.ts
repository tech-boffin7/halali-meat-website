export interface Product {
    id: string;
    name: string;
    category: string;
    type: 'CHILLED' | 'FROZEN';
    description: string;
    price: number;
    imageUrl: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
}
