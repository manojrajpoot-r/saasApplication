export interface ITenant {
    id: number;
    name: string;
    subDomain: string;
    adminName: string;
    adminEmail: string;
    password: string;
    isActive: boolean;
}

export interface ITenantRequest {
    name: string;
    subDomain: string;
    adminName: string;
    adminEmail: string;
    password: string;
}
