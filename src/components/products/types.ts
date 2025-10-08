export interface Product {
    id: string;
    name: string;
    category: 'Beef' | 'Lamb' | 'Goat' | 'Camel' | 'Poultry' | 'Offal';
    type: 'frozen' | 'chilled';
    description: string;
    image: string;
}
