import { Component } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert/alert';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RippleModule } from 'primeng/ripple';
import { AppFloatingConfigurator } from '../../../../app/layout/component/app.floatingconfigurator';
import { LoginRequest, LoginResponse } from 'src/app/core/models/auth';
@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ButtonModule, CheckboxModule, InputTextModule, PasswordModule, FormsModule, RouterModule, RippleModule,
        AppFloatingConfigurator, ReactiveFormsModule],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class LoginComponent {
    loginForm!: FormGroup;
    rememberMe: boolean = false;
    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder,
        private alertService: AlertService) { }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            checked: [false]
        });
    }


  onSubmitLogin() {

    if (this.loginForm.invalid) {
        this.loginForm.markAllAsTouched();
        return;
    }

    if (this.loginForm.value.checked) {
        localStorage.setItem('rememberMe', 'true');
    }

    const isPlatformUser =
        this.router.url.startsWith('/admin');

    const request: LoginRequest = {
        ...this.loginForm.getRawValue(),
        isPlatformUser
    };

    this.authService.login(request).subscribe({

        next: (res: LoginResponse) => {
            console.log(res);

            this.authService.saveCurrentUser(
                res.data.user
            );

            this.alertService.success('Login successful!');

            setTimeout(() => {
                this.router.navigate(['/admin/dashboard']);
            }, 2000);
        },

        error: (err) => {
            this.alertService.error(
                err.error?.message || 'Login failed'
            );
        }
    });
}

    logout() {
        this.authService.logout();
        this.alertService.info('Logged out successfully.');
        this.router.navigate(['/login']);
    }

}
