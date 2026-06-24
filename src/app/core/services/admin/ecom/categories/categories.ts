
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { ICategory, ICategoryRequest } from '@/app/core/models/Ecom/categories/category.model';
@Injectable({
    providedIn: 'root'
})
export class CategoriesService extends BaseApiService<
    ICategory,
    ICategoryRequest,
    ICategoryRequest
> {

    protected endpoint = environment.apiUrl + '/Category';
}
