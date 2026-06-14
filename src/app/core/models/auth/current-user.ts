export interface CurrentUser {
    id: number;
    fullName?: string;   // ? laga do
    email: string;
    tenantId?: number;
    roles: string[];
    permissions: string[];
}