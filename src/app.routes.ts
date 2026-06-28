import { Routes } from '@angular/router';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';

export const appRoutes: Routes = [

    {
        path: '',
        loadChildren: () =>
            import('./app/features/routes/website.routes')
                .then(m => m.WEBSITE_ROUTES)
    },

    {
        path: 'admin',
        loadChildren: () =>
            import('./app/features/auth/auth.routes')
                .then(m => m.AUTH_ROUTES)
    },

    {
        path: 'tenant',
        loadChildren: () =>
            import('./app/features/auth/auth.routes')
                .then(m => m.AUTH_ROUTES)
    },

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
        path: '**',
        redirectTo: 'notfound'
    }
];
