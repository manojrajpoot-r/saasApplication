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
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },


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
                path: 'plans',
                loadComponent: () =>
                    import('../tenants/plan-list/plan-list')
                        .then(m => m.PlanListComponent)
            },

            {
                path: 'my-subscriptions',
                loadComponent: () =>
                    import('../tenants/subscription-list/subscription-list')
                        .then(m => m.SubscriptionListComponent)
            },

            {
                path: 'payment-history',
                loadComponent: () =>
                    import('../tenants/payment-history/payment-history')
                        .then(m => m.PaymentHistoryComponent)
            },
            
            {
                path: 'my-profile',
                loadComponent: () =>
                    import('../tenants/my-profile/my-profile')
                        .then(m => m.MyProfileComponent)
            },




             {
                path: 'categories',
                loadComponent: () =>
                    import('../tenants/ecom/categories/categories')
                        .then(m => m.CategoryComponent)
            },

            {
                path: 'sub-categories',
                loadComponent: () =>
                    import('../tenants/ecom/sub-categories/sub-categories')
                        .then(m => m.SubCategoryComponent)
            },
            
            {

             path: 'brands-products',
                loadComponent: () =>
                    import('../tenants/ecom/brands/brands')
                        .then(m => m.BrandComponent)
            },

            {
             path: 'products',
                loadComponent: () =>
                    import('../tenants/ecom/products/products')
                        .then(m => m.ProductComponent)
            },

            {

             path: 'product-gallery/:id',
                loadComponent: () =>
                    import('../tenants/ecom/product-gallery/product-gallery')
                        .then(m => m.ProductGalleryComponent)
            },

           

            {
             path: 'colors-products',
                loadComponent: () =>
                    import('../tenants/ecom/colors/colors')
                        .then(m => m.ColorComponent)
            },


             {
             path: 'sizes-products',
                loadComponent: () =>
                    import('../tenants/ecom/sizes/sizes')
                        .then(m => m.SizeComponent)
            },

            {
             path: 'products-varient',
                loadComponent: () =>
                    import('../tenants/ecom/product-varient/product-varient')
                        .then(m => m.ProductVarientComponent)
            },

        ]
    }
];
