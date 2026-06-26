 
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IProduct,IProductRequest } from '@/app/core/models/Ecom/products/product.model';
@Injectable({
    providedIn: 'root'
})
export class ProductsService extends BaseApiService<
    IProduct,
    IProductRequest,
    IProductRequest
> {

    protected endpoint = environment.apiUrl + '/Products';

}
