import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading/loading';
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private loading: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        this.loading.show();

        return next.handle(req).pipe(
            finalize(() => {
                this.loading.hide();
            })
        );
    }
}
