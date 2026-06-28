import { Routes } from '@angular/router';
import { WebsiteLayout } from '../../layout/websites/website-layout/website-layout';

export const WEBSITE_ROUTES: Routes = [
  {
    path: '',
    component: WebsiteLayout,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../../features/tenants/ecom/website/home/home').then(m => m.HomeComponent)
      },
     
    ]
  }
];