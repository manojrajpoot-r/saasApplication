import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth/auth';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from 'src/app/core/services/alert/alert';
@Component({
    selector: 'app-login',
    imports: [],
    templateUrl: './login.html',
    styleUrl: './login.scss',
})
export class Login {
    loginForm!: FormGroup;


    constructor(private authService: AuthService, private router: Router, private formBuilder: FormBuilder, private alertService: AlertService) { }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }


    onSubmitLogin() {

        this.authService.login({
            email: this.loginForm.value.email,
            password: this.loginForm.value.password
        }).subscribe({
            next: (res) => {
                this.authService.saveCurrentUser(res.user);
                this.alertService.success('Login successful!');
                this.router.navigate(['admin/dashboard']);
            },
            error: (err) => {
                this.alertService.error('Login failed. Please check your credentials and try again.');
                console.log(err);
            }
        });

    }

    logout() {
        this.authService.logout();
        this.alertService.info('Logged out successfully.');
        this.router.navigate(['/login']);
    }

}
