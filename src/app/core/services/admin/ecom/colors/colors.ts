
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IColor, IColorRequest } from '@/app/core/models/Ecom/colors/color.model';
import { map } from 'rxjs';
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
@Injectable({
    providedIn: 'root'
})
export class ColorsService extends BaseApiService<
    IColor,
    IColorRequest,
    IColorRequest
> {

    protected endpoint = environment.apiUrl + '/Color';
    getDropdown() {
        return this.http
            .get<ApiResponse<IColor[]>>(
                `${this.endpoint}/frontend`
            )
            .pipe(
                map(res => res.data)
            );
    }
}


