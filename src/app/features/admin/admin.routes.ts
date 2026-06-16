import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { AppLayout } from '../../../app/layout/component/app.layout';

export const ADMIN_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./dashboard/dashboard')
                        .then(m => m.Dashboard)
            },
            {
                path: 'roles',
                loadComponent: () =>
                    import('./roles/roles')
                        .then(m => m.RolesComponent)
            },
            {
                path: 'roles/:id/permissions',
                loadComponent: () =>
                    import('./roles/role-permission/role-permission')
                        .then(m => m.RolePermissionComponent)
            },
            {
                path: 'users',
                loadComponent: () =>
                    import('./users/users')
                        .then(m => m.UsersComponent)
            },
            {
                path: 'tenants',
                loadComponent: () =>
                    import('./tenants/tenants')
                        .then(m => m.TenantsComponent)
            },
            {
                path: 'permissions',
                loadComponent: () =>
                    import('./permissions/permissions')
                        .then(m => m.PermissionsComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
