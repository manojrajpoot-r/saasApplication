
import { Injectable } from '@angular/core';
import { BaseApiService } from '../../apiServices/base-api.service';
import { environment } from '@/app/environments/environment';
import { IPlan, IPlanRequest} from '@/app/core/models/plans/plan.model';

@Injectable({
    providedIn: 'root'
})
export class PlanService extends BaseApiService<
    IPlan,
    IPlanRequest,
    IPlanRequest
> {

    protected endpoint = environment.apiUrl + '/Plan';
}
