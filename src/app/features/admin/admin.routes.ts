import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth-guard';
import { AppLayout } from './../../../app/layout/component/app.layout';
export const ADMIN_ROUTES: Routes = [


    {
        path: 'dashboard',
        canActivate: [authGuard],
        component: AppLayout,
        children: [
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./dashboard/dashboard')
                        .then(m => m.Dashboard)
            }
        ]
    }

];
