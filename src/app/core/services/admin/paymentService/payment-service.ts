import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class PaymentService {

    private http = inject(HttpClient);

    private apiUrl = environment.apiUrl + '/Payment'


    getAll(pageNumber: number, pageSize: number, search: string): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/GetAll`,
            {
                pageNumber,
                pageSize,
                search
            }
        );
    }

    getById(id: number): Observable<any> {
        return this.http.get(
            `${this.apiUrl}/GetById/${id}`
        );
    }

    create(payload: any): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/Create`,
            payload
        );
    }

    updateStatus(payload: any): Observable<any> {
        return this.http.post(
            `${this.apiUrl}/UpdateStatus`,
            payload
        );
    }

    delete(id: number): Observable<any> {
        return this.http.delete(
            `${this.apiUrl}/Delete/${id}`
        );
    }

    createOrder(planId: number) {
        return this.http.post(
            `${environment.apiUrl}/Payment/CreateOrder`,
            {
                planId: planId
            }
        );
    }

    verifyPayment(data: any) {
        return this.http.post(
            `${environment.apiUrl}/Payment/VerifyPayment`,
            data
        );
    }
}
