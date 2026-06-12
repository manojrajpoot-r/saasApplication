import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ValidationService } from '@shared/validation/validation.service';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(private validation: ValidationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {

        return next.handle(req).pipe(

            catchError((error: HttpErrorResponse) => {

                let message = 'Something went wrong';

                if (error.error?.code) {
                    message = this.validation.getBackendMessage(error.error.code);
                }

                alert(message);

                return throwError(() => error);
            })
        );
    }
}
