export interface IProduct {
    id: number;
    categoryId: number;
    subCategoryId: number;
    brandId: number;
    shortDescription: string;
    price: string;
    discountPercentage: string;
    discountPrice: number;
    quantity: number;
    name: string;
    description: string;
    image:string;
    status: boolean;
    IsFeatured: boolean;
}

export interface IProductRequest {
    name: string;
    description: string;

}
