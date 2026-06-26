
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IProduct, IProductRequest } from '@/app/core/models/Ecom/products/product.model';
import { map } from 'rxjs';
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
@Injectable({
    providedIn: 'root'
})
export class ProductsService extends BaseApiService<
    IProduct,
    IProductRequest,
    IProductRequest
> {

    protected endpoint = environment.apiUrl + '/Products';

    getDropdown() {
        return this.http
            .get<ApiResponse<IProduct[]>>(
                `${this.endpoint}/latest`
            )
            .pipe(
                map(res => res.data)
            );
    }
}
