import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';
import { AuthService } from '@/app/core/services/auth/auth.service';
import { inject } from '@angular/core';
@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        @for (item of model; track item.label) {
            @if (!item.separator) {
                <li app-menuitem [item]="item" [root]="true"></li>
            } @else {
                <li class="menu-separator"></li>
            }
        }
    </ul> `,
})
export class AppMenu {
    model: MenuItem[] = [];

    private authService = inject(AuthService);
    ngOnInit() {

        if (this.authService.isPlatformUser()) {
            this.model = [
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    path: '/pages',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-fw pi-globe',
                            routerLink: ['/admin/dashboard']
                        },
                        {
                            label: 'Auth',
                            icon: 'pi pi-fw pi-user',
                            path: '/auth',
                            items: [
                                {
                                    label: 'Roles',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/admin/roles']
                                },
                                {
                                    label: 'Users',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/admin/users']
                                },
                                {
                                    label: 'Tenants',
                                    icon: 'pi pi-fw pi-lock',
                                    routerLink: ['/admin/tenants']
                                },
                                {
                                    label: 'Permissions',
                                    icon: 'pi pi-fw pi-pencil',
                                    routerLink: ['/admin/permissions']
                                }
                            ]
                        }
                    ]
                }
            ];
        } else {
            this.model = [
                {
                    label: 'Pages',
                    icon: 'pi pi-fw pi-briefcase',
                    path: '/pages',
                    items: [
                        {
                            label: 'Dashboard',
                            icon: 'pi pi-fw pi-globe',
                            routerLink: ['/tenant/dashboard']
                        },
                        {
                            label: 'Auth',
                            icon: 'pi pi-fw pi-user',
                            path: '/auth',
                            items: [
                                {
                                    label: 'Roles',
                                    icon: 'pi pi-fw pi-sign-in',
                                    routerLink: ['/tenant/roles']
                                },
                                {
                                    label: 'Users',
                                    icon: 'pi pi-fw pi-user',
                                    routerLink: ['/tenant/users']
                                }
                            ]
                        }
                    ]
                }
            ];
        }
    }
}
