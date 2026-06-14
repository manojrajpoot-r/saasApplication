export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
        expiresAt: string;
        user: {
            id: number;
            email: string;
            tenantId?: number;
            roles: string[];
            permissions: string[];
        };
    };
}