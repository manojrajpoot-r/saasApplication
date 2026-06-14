export interface IUser {
    id: number;
    fullName: string;
    email: string;
    password: string;
}

export interface IUserRequest {
    fullName: string;
    email: string;
    password: string;
}