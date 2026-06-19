import { Routes } from '@angular/router';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [

    { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },

    // Admin Login
    {
        path: 'admin',
        loadChildren: () =>
            import('./app/features/auth/auth.routes')
                .then(m => m.AUTH_ROUTES)
    },

    // Tenant Login
    {
        path: 'tenant',
        loadChildren: () =>
            import('./app/features/auth/auth.routes')
                .then(m => m.AUTH_ROUTES)
    },

    // Admin Module
    {
        path: 'admin',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./app/features/routes/admin.routes')
                        .then(m => m.ADMIN_ROUTES)
            }
        ]
    },

    // Tenant Module
    {
        path: 'tenant',
        children: [
            {
                path: '',
                loadChildren: () =>
                    import('./app/features/routes/tenant.routes')
                        .then(m => m.TENANT_ROUTES)
            }
        ]
    },

    {
        path: '',
        redirectTo: 'admin/login',
        pathMatch: 'full'
    },

    {
        path: '**',
        redirectTo: 'notfound'
    }
];
