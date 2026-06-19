export interface ISubcription {
    id: number;
    tenantId: string;
    planId: string;
    TenantSubscriptions: boolean;
}

export interface ISubcriptionRequest {
     tenantId: string;
    planId: string;
   
}


