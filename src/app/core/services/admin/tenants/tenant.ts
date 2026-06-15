import { Injectable } from '@angular/core';
import { BaseApiService } from '../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { ITenant, ITenantRequest } from '@/app/core/models/tenants/tenant.model';
@Injectable({
    providedIn: 'root'
})
export class TenantService extends BaseApiService<
    ITenant,
    ITenantRequest,
    ITenantRequest
> {

    protected endpoint = environment.apiUrl + '/Tenant';
}

