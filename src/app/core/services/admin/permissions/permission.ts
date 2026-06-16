
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IPermission, IPermissionRequest } from '@/app/core/models/permissions/permission.model';
@Injectable({
    providedIn: 'root'
})
export class PermissionService extends BaseApiService<
    IPermission,
    IPermissionRequest,
    IPermissionRequest
> {

    protected endpoint = environment.apiUrl + '/Permission';
}

