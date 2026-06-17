import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@/app/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AssignRolePermissionService {

    private apiUrl = environment.apiUrl + '/AssignRolePermission';

    constructor(
        private http: HttpClient
    ) { }

    assignPermission(data: any) {
        return this.http.post(`${this.apiUrl}/assign-permission`, data);
    }

    getRolePermissions(roleId: number) {
        return this.http.get(
            `${this.apiUrl}/role-permissions/${roleId}`
        );
    }
}
