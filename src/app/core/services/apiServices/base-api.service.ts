import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';



export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}
export abstract class BaseApiService<T, TCreate, TUpdate> {

    protected http = inject(HttpClient);

    protected abstract endpoint: string;




    getAll(pageNumber = 1, pageSize = 10, search = '') {
        return this.http.post<ApiResponse<T[]>>(
            `${this.endpoint}/list`,
            {
                pageNumber,
                pageSize,
                search
            }
        );
    }


    getById(id: number): Observable<T> {
        return this.http.get<T>(`${this.endpoint}/${id}`);
    }

    create(payload: TCreate): Observable<T> {
        return this.http.post<T>(this.endpoint, payload);
    }

    update(id: number, payload: TUpdate): Observable<T> {
        return this.http.put<T>(
            `${this.endpoint}/${id}`,
            payload
        );
    }

    delete(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.endpoint}/${id}`
        );
    }
    changeStatus(id: number) {
        return this.http.patch(
            `${this.endpoint}/status/${id}`,
            {}
        );
    }
}
