export interface IProductVarient {
    id: number;
    productId: number;
    colorId: number;
    sizeId: number;
    price: number;
    stock: number;
    IsActive: boolean;

}

export interface IProductVarientRequest {
    productId: number;
    colorId: number;
    sizeId: number;
    price: number;
    stock: number;

}
