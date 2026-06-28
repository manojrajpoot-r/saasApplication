
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IProductGallery, IProductGalleryRequest } from '@/app/core/models/Ecom/product-gallaery/product-gallery.model';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
export interface ApiResponse<T> {
    success: boolean;
    message: string | null;
    data: T;
}
@Injectable({
    providedIn: 'root'
})
export class ProducGallaryService extends BaseApiService<
    IProductGallery,
    IProductGalleryRequest,
    IProductGalleryRequest
> {

    protected endpoint = environment.apiUrl + '/ProductImage';

        getByProductId(productId: number): Observable<any> {
          return this.http.get<any>(
              `${this.endpoint}/${productId}`
          );
        }

        setPrimary(id: number): Observable<any> {
          return this.http.put<any>(
              `${this.endpoint}/set-primary/${id}`,
              {}
          );
        }
}
