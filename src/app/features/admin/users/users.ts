
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@/app/core/services/admin/users/user';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { IUser } from '@/app/core/models/users/user.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { FormsModule, FormArray, FormControl } from '@angular/forms';
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
import { DynamicInputArrayComponent } from '@/app/shared/dynamic-input-array/dynamic-input-array';

@Component({
    standalone: true,
    imports: [
        ReactiveFormsModule,
        CommonModule,
        FormsModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        ButtonModule,
        InputTextModule,
        DialogModule,
        ConfirmDialogModule,
        FormErrorDirective,
        ValidationSummaryComponent,
        BaseTableComponent,
        DynamicInputArrayComponent
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

    handleDialog: boolean = false;
    user!: IUser;
    submitted: boolean = false;
    selectedCheckBox!: IUser[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "user Details";

    columns: TableColumn[] = [
        {
            field: 'fullName',
            header: 'Full Name',
            sortable: true
        },

        {
            field: 'email',
            header: 'Email',
            sortable: true,

        }
    ];

    actions: TableAction[] = [

        {
            action: 'edit',
            icon: 'pi pi-pencil',
            severity: 'info'
        },
        {
            action: 'delete',
            icon: 'pi pi-trash',
            severity: 'danger'
        }
    ];


    load(): void {
        // implementation
    }

    refreshusers(): void {
        this.search.set(this.search()); // re-trigger API
    }

    handleAction(event: { action: string; row: IUser; }) {

        const user = event.row;

        switch (event.action) {

            case 'edit':
                this.handleEdit(user);
                break;

            case 'delete':
                this.handleDelete(user);
                break;


        }
    }

    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }



    users = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),

            switchMap(({ search }) =>
                this.userService.getAll(1, 10, search)
            ),

            tap(res => {
                console.log('API Response:', res);
                console.log(res.data);
            }),

            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );

    handleForm = this.fb.nonNullable.group({
        fullName: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],


    });



    openNew() {
        this.isEditMode = false;
        this.selectedId = null;
        this.submitted = false;
        this.handleForm.reset();

        this.handleDialog = true;
    }

    hideDialog(): void {
        this.handleDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.handleForm.reset();
    }

    handleEdit(user: IUser) {
        this.isEditMode = true;
        this.selectedId = user.id;

        this.handleForm.patchValue({
            fullName: user.fullName
        });

        this.handleForm.patchValue({
            email: user.email
        });

        this.handleDialog = true;
    }

    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const formValue = this.handleForm.getRawValue();

        const payload = {
            fullName: formValue.fullName,
            email: formValue.email,
            password: formValue.password
        };

        const req = this.selectedId
            ? this.userService.update(this.selectedId, payload)
            : this.userService.create(payload);

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

    handleDeleteselected(): void {

        if (!this.selectedCheckBox || this.selectedCheckBox.length === 0) return;

        this.confirm.confirm({
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} users?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedCheckBox!.map(user =>
                    this.userService.delete(user.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('users deleted successfully');
                        this.selectedCheckBox = null;
                        this.refreshusers();
                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error('Some deletions failed');
                    }
                });
            }
        });
    }

    handleDelete(user: IUser) {

        this.alert.confirm(
            `Do you want to delete "${user.fullName}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.userService.delete(user.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${user.fullName}" deleted successfully`
                    );

                    this.refreshTrigger.update(v => v + 1);
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${user.fullName}"`
                    );
                }
            });

        });
    }




}
