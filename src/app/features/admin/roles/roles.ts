



import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RoleService } from '@/app/core/services/admin/roles/role';
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




    ],

    selector: 'app-roles',
    templateUrl: './roles.html',
    styleUrl: './roles.scss',
    providers: [MessageService, ConfirmationService]
})



export class RolesComponent extends BaseCrudComponent<IRole> {
    private fb = inject(FormBuilder);
    private RoleService = inject(RoleService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private router = inject(Router);
    handleDialog: boolean = false;
    role!: IRole;
    submitted: boolean = false;
    selectedCheckBox!: IRole[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Role Details"

    load(): void {
        // implementation
    }

    refreshroles(): void {
        this.search.set(this.search()); // re-trigger API
    }

    columns: TableColumn[] = [
        {
            field: 'name',
            header: 'Name',
            sortable: true
        },

        {
            field: 'status',
            header: 'Status',
            sortable: true,
            type: 'tag'
        }
    ];

    actions: TableAction[] = [
        {
            action: 'edit',
            icon: 'pi pi-pencil',
            severity: 'info',
            tooltip: 'Edit'
        },
        {
            action: 'delete',
            icon: 'pi pi-trash',
            severity: 'danger',
            tooltip: 'Delete'
        },
        {
            action: 'assignPermission',
            icon: 'pi pi-shield',
            severity: 'warn',
            tooltip: 'Assign Permission'
        }
    ];


    handleAction(event: ActionEvent<IRole>): void {
        const role = event.row;

        switch (event.action) {
            case 'assignPermission':
                this.assignPermission(role);
                break;

            case 'edit':
                this.handleEdit(role);
                break;

            case 'delete':
                this.handleDelete(role);
                break;

            case 'toggleStatus':
                this.toggleStatus(role);
                break;
        }
    }




    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }

    roles = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.RoleService.getAll(1, 10, search)
            ),
            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );

    handleForm = this.fb.nonNullable.group({
        name: ['', Validators.required],

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

    handleEdit(role: IRole) {
        //console.log(role);
        this.isEditMode = true;
        this.selectedId = role.id;
        this.handleForm.patchValue({
            name: role.name,
        });
        this.handleDialog = true;
    }

    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const payload = this.handleForm.getRawValue();

        const req = this.selectedId
            ? this.RoleService.update(this.selectedId, payload)
            : this.RoleService.create(payload);

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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} roles?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedCheckBox!.map(role =>
                    this.RoleService.delete(role.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('roles deleted successfully');
                        this.selectedCheckBox = null;
                        this.refreshroles();
                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error('Some deletions failed');
                    }
                });
            }
        });
    }

    handleDelete(role: IRole) {

        this.alert.confirm(
            `Do you want to delete "${role.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.RoleService.delete(role.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${role.name}" deleted successfully`
                    );

                    this.refreshTrigger.update(v => v + 1);
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${role.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(role: IRole) {

        const action = role.status
            ? 'Deactivate'
            : 'Activate';

        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${role.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.RoleService.changeStatus(role.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${role.name}" ${action}d successfully`
                        );

                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${role.name}"`
                        );
                    }
                });

        });
    }

    assignPermission(role: IRole) {
        this.router.navigate([
            'admin/roles',
            role.id,
            'permissions'
        ]);
    }
}
