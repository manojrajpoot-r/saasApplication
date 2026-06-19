export interface CurrentUser {
    id: number;
    fullName?: string;
    email: string;
    tenantId?: number;
    roles: string[];
    permissions: string[];
    isPlatformUser?: boolean;
}

