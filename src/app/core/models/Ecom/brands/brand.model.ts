export interface IBrand {
    id: number;
    name: string;
    description: string;
    image:string;
    status: boolean;
}

export interface IBrandRequest {
    name: string;
    description: string;

}
