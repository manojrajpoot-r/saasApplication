import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);

    private apiUrl = environment.apiUrl + '/auth';

    login(data: any): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
            })
        );
    }

    refreshToken(): Observable<any> {

        const payload = {
            token: localStorage.getItem('token'),
            refreshToken: localStorage.getItem('refreshToken')
        };

        return this.http.post<any>(`${this.apiUrl}/refresh-token`, payload).pipe(
            tap(response => {
                localStorage.setItem('token', response.token);
                localStorage.setItem('refreshToken', response.refreshToken);
            })
        );
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');
    }

    getCurrentUser(): any {
        const user = localStorage.getItem('currentUser');

        return user ? JSON.parse(user) : null;
    }

    saveCurrentUser(user: any): void {
        localStorage.setItem('currentUser', JSON.stringify(user));
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}

