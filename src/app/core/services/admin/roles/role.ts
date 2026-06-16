
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IRole, IRoleRequest } from '@/app/core/models/roles/role.model';
@Injectable({
    providedIn: 'root'
})
export class RoleService extends BaseApiService<
    IRole,
    IRoleRequest,
    IRoleRequest
> {

    protected endpoint = environment.apiUrl + '/Role';
}

