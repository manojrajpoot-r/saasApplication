
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { ISubcription, ISubcriptionRequest } from '@/app/core/models/subcriptions/subcription.model';
@Injectable({
    providedIn: 'root'
})
export class SubcriptionService extends BaseApiService<
    ISubcription,
    ISubcriptionRequest,
    ISubcriptionRequest
> {

    protected endpoint = environment.apiUrl + '/Subscription';

    renewSubscription(id: number) {
        return this.http.put(
            `${this.endpoint}/${id}/renew`,
            {}
        );
    }
}
