
interface IMenu {
    menuId: any;
    id: string;
    name: string;
    desctiption: string;
    price: number;
    image_url: string;
    category: string;
    isAvailable: string;
}

interface ICart {
    menuId?: string;
    quantity: number;
    notes?: string;
    menuItem?: IMenu;
    name?: string;
};

interface IOrder {
    id: string;
    customer_name: string;
    table_number: number;
    cart: ICart[];
    status: 'PENDING' | 'PROCESSING' | 'COMPLETE';
    total: number;
};

export type { IOrder, ICart, IMenu };