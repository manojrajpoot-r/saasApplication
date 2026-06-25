
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { ICategory, ICategoryRequest } from '@/app/core/models/Ecom/categories/category.model';
import { map } from 'rxjs/operators';
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
@Injectable({
    providedIn: 'root'
})

export class CategoriesService extends BaseApiService<
    ICategory,
    ICategoryRequest,
    ICategoryRequest
> {

    protected endpoint = environment.apiUrl + '/Category';


    getDropdown() {
        return this.http
            .get<ApiResponse<ICategory[]>>(
                `${environment.apiUrl}/Category/frontend`
            )
            .pipe(
                map(res => res.data)
            );
    }
}
