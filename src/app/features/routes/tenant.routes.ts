import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { AppLayout } from '../../../app/layout/component/app.layout';

export const TENANT_ROUTES: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('../admin/dashboard/dashboard')
                        .then(m => m.Dashboard)
            },
            {
                path: 'roles',
                loadComponent: () =>
                    import('../admin/roles/roles')
                        .then(m => m.RolesComponent)
            },
            {
                path: 'roles/:id/permissions',
                loadComponent: () =>
                    import('../admin/roles/role-permission/role-permission')
                        .then(m => m.RolePermissionComponent)
            },
            {
                path: 'users',
                loadComponent: () =>
                    import('../admin/users/users')
                        .then(m => m.UsersComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
