import { Injectable } from '@angular/core';
import { BaseApiService } from '../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IUser, IUserRequest, IUpdateUserRequest } from '@/app/core/models/users/user.model';
@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseApiService<
    IUser,
    IUserRequest,
    IUpdateUserRequest
> {

    protected endpoint = environment.apiUrl + '/User';

    changePassword(payload: { userId: string; newPassword: string }) {
        return this.http.post(`${this.endpoint}/ChangePassword`, payload);
    }
}
