import { Injectable } from '@angular/core';
import { environment } from '@/app/environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
    providedIn: 'root',
})


export class UploadService {

    private endpoint = environment.apiUrl + '/File';

    constructor(private http: HttpClient) { }

    uploadImage(file: File) {

        const formData = new FormData();
        formData.append('file', file);

        return this.http.post<any>(
            `${this.endpoint}/upload-image`,
            formData
        );
    }
}
