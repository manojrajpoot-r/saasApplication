
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@/app/core/services/admin/users/user';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { IUser } from '@/app/core/models/users/user.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorDirective } from '@/app/shared/validation/form-error.directive';
import { ValidationSummaryComponent } from '@/app/shared/validation/validation-summary.component';
import { takeUntil } from 'rxjs/operators';
import { forkJoin, Subject } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';



interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule,
        FormErrorDirective,
        ValidationSummaryComponent
    ],
    selector: 'app-users',
    templateUrl: './users.html',
    styleUrl: './users.scss',
    providers: [MessageService, ConfirmationService]
})
export class UsersComponent extends BaseCrudComponent<IUser> {
    private fb = inject(FormBuilder);
    private userService = inject(UserService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);


    userDialog: boolean = false;
    user!: IUser;
    submitted: boolean = false;
    selectedUsers!: IUser[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');

    @ViewChild('dt') dt!: Table;

    exportCSV() {
        this.dt.exportCSV();
    }

    exportColumns!: ExportColumn[];

    cols!: Column[];


    load(): void {
        // implementation
    }

    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }

    // USERS STREAM (PROPER CLEAN SIGNAL)
    users = toSignal(
        toObservable(this.search).pipe(
            debounceTime(300),
            distinctUntilChanged(),
            switchMap(s => this.userService.getAll(1, 10, s)),
            map(res => res.data)
        ),
        { initialValue: [] as IUser[] }
    );

    // FORM
    userForm = this.fb.nonNullable.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });



    openNew() {
        this.selectedId = null;
        this.submitted = false;

        this.userForm.reset();
        this.userForm.controls.password.setValidators([Validators.required]);
        this.userForm.controls.password.updateValueAndValidity();

        this.userDialog = true;
    }
    hideDialog(): void {
        this.userDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.userForm.reset();
    }
    editUser(user: any) {
        this.selectedId = user.id;

        this.userForm.patchValue({
            fullName: user.fullName,
            email: user.email,
            password: ''
        });

        this.userForm.controls.password.clearValidators();
        this.userForm.controls.password.updateValueAndValidity();

        this.userDialog = true;
    }

    onUserSubmit() {
        this.submitted = true;
        if (this.userForm.invalid) return;

        const payload = this.userForm.getRawValue();

        const req = this.selectedId
            ? this.userService.update(this.selectedId, payload)
            : this.userService.create(payload);

        req.subscribe({
            next: () => {
                this.alert.success('Saved Successfully');
                this.userDialog = false;
            },
            error: (err) => {
                console.log(err);
                this.alert.error('Error');
            }
        });
    }
    refreshUsers(): void {
        this.search.set(this.search()); // re-trigger API
    }
    deleteSelectedUsers(): void {

        if (!this.selectedUsers || this.selectedUsers.length === 0) return;

        this.confirm.confirm({
            message: `Are you sure you want to delete ${this.selectedUsers.length} users?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedUsers!.map(user =>
                    this.userService.delete(user.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('Users deleted successfully');
                        this.selectedUsers = null;
                        this.refreshUsers();
                    },
                    error: () => {
                        this.alert.error('Some deletions failed');
                    }
                });
            }
        });
    }
    deleteUser(user: any) {
        this.confirm.confirm({
            message: 'Delete user?',
            accept: () => {
                this.userService.delete(user.id).subscribe(() => {
                    this.alert.success('Deleted');
                });
            }
        });
    }

    toggleStatus(user: any) {
        this.userService.changeStatus(user.id)
            .subscribe(() => {
                this.alert.success('Status Updated');
            });
    }
}



