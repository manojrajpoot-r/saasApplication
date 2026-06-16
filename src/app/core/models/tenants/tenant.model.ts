export interface ITenant {
    id: number;
    name: string;
    subdomain: string;
    adminName: string;
    adminEmail: string;
    password: string;
    isActive: boolean;
}

export interface ITenantRequest {
    name: string;
    subdomain: string;
    adminName: string;
    adminEmail: string;
    password: string;
}
