import { Injectable } from '@angular/core';
import { BaseApiService } from '../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IUser,IUserRequest } from '@/app/core/models/users/user.model';
@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseApiService<
    IUser,
    IUserRequest,
    IUserRequest
> {

    protected endpoint = environment.apiUrl + '/User';

    changePassword(userId: string, newPassword: string) {
        const payload = { userId, newPassword };
        return this.http.post(`${this.endpoint}/ChangePassword`, payload);
    }
}