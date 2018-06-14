export interface IParagon {
    products: IProduct[];
}

export interface IProduct {
    name: string;
}

export interface IProductWithCount extends IProduct {
    count: number;
}