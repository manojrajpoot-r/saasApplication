export interface IPlan {
    id: number;
    name: string;
    price: number;
    durationInMonths:number;
    maxUsers:number;
    isActive:boolean;
}

export interface IPlanRequest {
    name: string;
    price: number;
    durationInMonths:number;
    maxUsers:number;

}
