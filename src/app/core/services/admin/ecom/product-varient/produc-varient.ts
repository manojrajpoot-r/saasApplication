
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IProductVarient, IProductVarientRequest } from '@/app/core/models/Ecom/product-varient/product-varient.model';
@Injectable({
    providedIn: 'root'
})
export class ProducVarientService extends BaseApiService<
    IProductVarient,
    IProductVarientRequest,
    IProductVarientRequest
> {

    protected endpoint = environment.apiUrl + '/ProductsVarient';

}
