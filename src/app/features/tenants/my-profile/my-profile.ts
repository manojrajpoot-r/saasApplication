
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { IRole } from '@/app/core/models/roles/role.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorDirective } from '@/app/shared/validation/form-error.directive';
import { ValidationSummaryComponent } from '@/app/shared/validation/validation-summary.component';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
import { Router } from '@angular/router';
import { ActionType } from '@/app/shared/models/table-action.model';
import { ActionEvent } from '@/app/shared/models/table-action.model';
import { UserService } from '@/app/core/services/admin/users/user';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { IUser } from '@/app/core/models/users/user.model';
import { AuthService } from '@/app/core/services/auth/auth.service';
import { CurrentUser } from '@/app/core/models/auth/current-user';
@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RadioButtonModule,
        InputNumberModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ConfirmDialogModule,
        FormErrorDirective,
        ValidationSummaryComponent,
        BaseTableComponent,
        CardModule,
        AvatarModule,
        TagModule,
        DividerModule,

    ],



    selector: 'app-my-profile',
    templateUrl: './my-profile.html',
    styleUrl: './my-profile.scss',


    providers: [MessageService, ConfirmationService]
})



export class MyProfileComponent {

    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private router = inject(Router);
    private userService = inject(UserService);
    private authService = inject(AuthService);
    handleDialog: boolean = false;
    submitted: boolean = false;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Profile Details";
    users = signal<IUser[]>([]);
    selectedId: number | null = null;
    private fb = inject(FormBuilder);
    currentUser = signal<CurrentUser | null>(null);

    ngOnInit() {
        this.currentUser.set(this.authService.getCurrentUser());
    }


    handleForm = this.fb.nonNullable.group({
        fullName: ['', Validators.required],
        email: ['', Validators.required],
    });

    hideDialog(): void {
        this.handleDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.handleForm.reset();
    }

    handleEdit() {
        const user = this.currentUser();
        if (!user) return;
        this.selectedId = user.id;
        this.handleForm.patchValue({
            fullName: user.fullName ?? '',
            email: user.email ?? ''
        });

        this.handleDialog = true;
    }



    handleSubmit() {
        this.submitted = true;

        if (this.handleForm.invalid || !this.selectedId) {
            return;
        }

        const formValue = this.handleForm.getRawValue();

        const payload = {
            fullName: formValue.fullName,
            email: formValue.email
        };
        const req = this.userService.update(
            this.selectedId,
            payload
        );

        req.subscribe({
            next: () => {
                this.alert.success('Saved Successfully');
                this.handleDialog = false;
                this.refreshTrigger.update(v => v + 1);
            },
            error: (err) => {
                console.log(err);
                this.alert.error('Error');
            }
        });
    }


    passwordDialog = false;
    passwordForm = this.fb.nonNullable.group({
        currentPassword: ['', Validators.required],
        newPassword: ['', Validators.required],
        confirmPassword: ['', Validators.required]
    });

    openPasswordDialog() {
        this.passwordDialog = true;
    }


submitPassword() {
    this.submitted = true;

    if (this.passwordForm.invalid) {
        return;
    }

    const formValue = this.passwordForm.getRawValue();

    if (formValue.newPassword !== formValue.confirmPassword) {
        this.alert.error('Passwords do not match');
        return;
    }

    const payload = {
        userId: this.currentUser()?.id?.toString() ?? '',
        currentPassword: formValue.currentPassword,
        newPassword: formValue.newPassword
    };

    console.log(payload);

    this.userService.changePassword(payload).subscribe({
        next: () => {
            this.alert.success('Password Changed Successfully');
            this.passwordDialog = false;
            this.passwordForm.reset();
        },
        error: (err) => {
            console.log(err);
            this.alert.error('Failed to Change Password');
        }
    });
}

}
