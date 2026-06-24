export interface ISubCategory {
    id: number;
    categoryId: number;
    categoryName: string;
    name: string;
    description: string;
    image: string;
    status: boolean;
}

export interface ISubCategoryRequest {
    categoryId: number;
    name: string;
    description: string;
}
