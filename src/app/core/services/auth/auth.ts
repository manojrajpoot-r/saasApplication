import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { LoginRequest, LoginResponse } from 'src/app/core/models/auth';
import { BehaviorSubject } from 'rxjs';
import { CurrentUser } from '../../models/auth/current-user';
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/Auth';
 

    private currentUserSubject = new BehaviorSubject<CurrentUser | null>(
        JSON.parse(localStorage.getItem('currentUser') || 'null')
    );

    currentUser$ = this.currentUserSubject.asObservable();

    login(data: LoginRequest): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
            tap(response => {
                localStorage.setItem(
                'token',
                response.data.accessToken
            );

            localStorage.setItem(
                'refreshToken',
                response.data.refreshToken ?? ''
            );
            })
        );
    }


    saveCurrentUser(user: CurrentUser) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
    }

    getCurrentUser(): CurrentUser | null {
        return this.currentUserSubject.value;
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


    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}

