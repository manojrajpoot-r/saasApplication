export interface IUser {
    id: number;
    fullName: string;
    email: string;
    password: string;
    status: boolean;
}

export interface IUserRequest {
    fullName: string;
    email: string;
    password: string;
}
export interface IUpdateUserRequest {
    fullName: string;
    email: string;
}
