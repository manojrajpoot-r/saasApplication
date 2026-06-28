import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigurator } from '../../component/app.configurator';
import { LayoutService } from '../../../../app/layout/service/layout.service';
import { AuthService } from '@/app/core/services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '@/app/core/services/alert/alert';
import { Observable } from 'rxjs';
import { CurrentUser } from '@/app/core/models/auth/current-user';
import { Button } from 'primeng/button';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule, StyleClassModule, AppConfigurator],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class HeaderComponent {
    items!: MenuItem[];
    currentUser$!: Observable<CurrentUser | null>;
    layoutService = inject(LayoutService);

    constructor(
        private authService: AuthService,
        private router: Router,
        private alertService: AlertService
    ) { }
    toggleDarkMode() {
        this.layoutService.layoutConfig.update((state) => ({
            ...state,
            darkTheme: !state.darkTheme
        }));
    }

    ngOnInit() {
        this.currentUser$ = this.authService.currentUser$;
    }

    logout() {
        const isPlatformUser = this.authService.isPlatformUser();
        this.alertService.confirm(
            'Do you want to logout?'
        ).then(result => {
            if (result.isConfirmed) {
                this.authService.logout();
                if (isPlatformUser) {
                    this.router.navigate(['/admin/login']);
                } else {
                    this.router.navigate(['/tenant/login']);
                }
            }
        });
    }
}

