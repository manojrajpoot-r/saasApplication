
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { ISize, ISizeRequest } from '@/app/core/models/Ecom/sizes/size.model';
import { map } from 'rxjs';
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
@Injectable({
    providedIn: 'root'
})
export class SizesService extends BaseApiService<
    ISize,
    ISizeRequest,
    ISizeRequest
> {

    protected endpoint = environment.apiUrl + '/Size';

    getDropdown() {
        return this.http
            .get<ApiResponse<ISize[]>>(
                `${this.endpoint}/frontend`
            )
            .pipe(
                map(res => res.data)
            );
    }
}

