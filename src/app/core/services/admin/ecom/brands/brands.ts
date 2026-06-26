
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IBrand ,IBrandRequest} from '@/app/core/models/Ecom/brands/brand.model';
import { map } from 'rxjs/operators';
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
@Injectable({
    providedIn: 'root'
})
export class BrandsService extends BaseApiService<
    IBrand,
    IBrandRequest,
    IBrandRequest
> {

    protected endpoint = environment.apiUrl + '/Brands';

   getDropdown() {
        return this.http
            .get<ApiResponse<IBrand[]>>(
                `${this.endpoint}/frontend`
            )
            .pipe(
                map(res => res.data)
            );
    }

}

