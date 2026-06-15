import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface PagedResponse<T> {
    data: T[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
}
export abstract class BaseApiService<T, TCreate, TUpdate> {

    protected http = inject(HttpClient);

    protected abstract endpoint: string;



    getAllData(pageNumber = 1, pageSize = 10, search = '') {

        return this.http.post<PagedResponse<T>>(
            `${this.endpoint}/list`,
            {
                pageNumber,
                pageSize,
                search
            }
        );
    }

    getAll(
        pageNumber = 1,
        pageSize = 10,
        search = ''
    ): Observable<PagedResponse<T>> {

        const params = new HttpParams()
            .set('pageNumber', pageNumber)
            .set('pageSize', pageSize)
            .set('search', search);

        return this.http.get<PagedResponse<T>>(
            this.endpoint,
            { params }
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
    changeStatus(id: number, isActive: boolean) {
        return this.http.put(
            `${this.endpoint}/${id}/status`,
            { isActive }
        );
    }
}
