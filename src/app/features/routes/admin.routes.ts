import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { AppLayout } from '../../layout/component/app.layout';

export const ADMIN_ROUTES: Routes = [
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
                path: 'tenants',
                loadComponent: () =>
                    import('../admin/tenants/tenants')
                        .then(m => m.TenantsComponent)
            },
            {
                path: 'permissions',
                loadComponent: () =>
                    import('../admin/permissions/permissions')
                        .then(m => m.PermissionsComponent)
            },

            {
                path: 'plans',
                loadComponent: () =>
                    import('../admin/plans/plans')
                        .then(m => m.PlansComponent)
            },
                {
                path: 'subcriptions',
                loadComponent: () =>
                    import('../admin/subcriptions/subcriptions')
                        .then(m => m.SubcriptionsComponent)
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    }
];
