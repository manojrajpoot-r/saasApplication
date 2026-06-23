import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { environment } from 'src/app/environments/environment';
import { LoginRequest, LoginResponse } from 'src/app/core/models/auth';
import { CurrentUser } from '../../models/auth/current-user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    private http = inject(HttpClient);
    private apiUrl = environment.apiUrl + '/Auth';

    private currentUserSubject =
        new BehaviorSubject<CurrentUser | null>(
            this.getStoredUser()
        );

    currentUser$ = this.currentUserSubject.asObservable();

    private getStoredUser(): CurrentUser | null {

        const user = localStorage.getItem('currentUser');

        if (!user || user === 'undefined') {
            return null;
        }

        return JSON.parse(user);
    }

    login(data: LoginRequest): Observable<LoginResponse> {

        return this.http.post<LoginResponse>(
            `${this.apiUrl}/login`,
            data
        ).pipe(
            tap(response => {

                localStorage.setItem(
                    'token',
                    response.data.accessToken
                );

                localStorage.setItem(
                    'refreshToken',
                    response.data.refreshToken ?? ''
                );

                const payload = JSON.parse(
                    atob(
                        response.data.accessToken
                            .split('.')[1]
                    )
                );

                const currentUser: CurrentUser = {

                    id: Number(
                        payload[
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
                        ]
                    ),

                    fullName:
                        payload['FullName'] ??

                        payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
                        '',

                    email:
                        payload[
                        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'
                        ] ?? '',

                    tenantId: payload.TenantId,

                    isPlatformUser:
                        payload.IsPlatformUser === 'True',

                    roles: [
                        payload[
                        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                        ]
                    ],

                    permissions:
                        payload.Permission || []
                };

                this.saveCurrentUser(currentUser);


            })
        );
    }

    saveCurrentUser(user: CurrentUser): void {

        localStorage.setItem(
            'currentUser',
            JSON.stringify(user)
        );

        this.currentUserSubject.next(user);
    }

    getCurrentUser(): CurrentUser | null {
        return this.currentUserSubject.value;
    }

    isPlatformUser(): boolean {
        return this.getCurrentUser()?.isPlatformUser ?? false;
    }

    hasPermission(permission: string): boolean {

        return this.getCurrentUser()
            ?.permissions
            ?.includes(permission) ?? false;
    }

    logout(): void {

        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('currentUser');

        this.currentUserSubject.next(null);
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
