
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { ISubCategory, ISubCategoryRequest } from '@/app/core/models/Ecom/sub-category/sub-category.model';
import { map } from 'rxjs';
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
@Injectable({
    providedIn: 'root'
})
export class SubCategoriesService extends BaseApiService<
    ISubCategory,
    ISubCategoryRequest,
    ISubCategoryRequest
> {

    protected endpoint = environment.apiUrl + '/SubCategory';
       getDropdown() {
            return this.http
                .get<ApiResponse<ISubCategory[]>>(
                    `${this.endpoint}/frontend`
                )
                .pipe(
                    map(res => res.data)
                );
        }
}
