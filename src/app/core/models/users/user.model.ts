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
