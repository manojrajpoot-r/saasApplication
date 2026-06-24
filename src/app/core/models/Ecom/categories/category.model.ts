export interface ICategory {
    id: number;
    name: string;
    description: string;
    status: boolean;
}

export interface ICategoryRequest {
    name: string;
    description: string;

}
