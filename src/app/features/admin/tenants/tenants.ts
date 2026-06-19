

import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TenantService } from '@/app/core/services/admin/tenants/tenant';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { ITenant } from '@/app/core/models/tenants/tenant.model';
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
        BaseTableComponent
    ],
    selector: 'app-tenants',
    templateUrl: './tenants.html',
    styleUrl: './tenants.scss',
    providers: [MessageService, ConfirmationService]
})



export class TenantsComponent extends BaseCrudComponent<ITenant> {
    private fb = inject(FormBuilder);
    private tenantService = inject(TenantService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);

    handleDialog: boolean = false;
    tenant!: ITenant;
    submitted: boolean = false;
    selectedCheckBox!: ITenant[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Tenant Details";

    load(): void {
        // implementation
    }

    refreshtenants(): void {
        this.search.set(this.search()); // re-trigger API
    }
    columns: TableColumn[] = [
        {
            field: 'name',
            header: 'Name',
            sortable: true
        },
        {
            field: 'subdomain',
            header: 'Domain',
            sortable: true
        },
        {
            field: 'isActive',
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
            action: 'toggleStatus',
            icon: 'pi pi-power-off',
            severity: 'warn',
            tooltip: 'Toggle Status'

        }

    ];

    handleAction(event: ActionEvent<ITenant>): void {
        const role = event.row;

        switch (event.action) {
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

    tenants = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.tenantService.getAll(1, 10, search)
            ),
            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );

    handleForm = this.fb.nonNullable.group({
        name: ['', Validators.required],
        subdomain: ['', Validators.required],
        adminName: ['', Validators.required],
        adminEmail: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        roleName: ['', Validators.required],
   
    });


    openNew() {
        this.isEditMode = false;
        this.selectedId = null;
        this.submitted = false;
        this.handleForm.reset();
        this.handleForm.controls.password.setValidators([Validators.required]);
        this.handleForm.controls.password.updateValueAndValidity();
        this.handleDialog = true;
    }

    hideDialog(): void {
        this.handleDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.handleForm.reset();
    }

    handleEdit(tenant: ITenant) {
        this.isEditMode = true;
        this.selectedId = tenant.id;
        this.handleForm.patchValue({
            name: tenant.name,
            subdomain: tenant.subdomain,

        });

        this.handleForm.controls.password.clearValidators();
        this.handleForm.controls.password.updateValueAndValidity();

        this.handleDialog = true;
    }

    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const payload = this.handleForm.getRawValue();

        const req = this.selectedId
            ? this.tenantService.update(this.selectedId, payload)
            : this.tenantService.create(payload);

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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} tenants?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedCheckBox!.map(tenant =>
                    this.tenantService.delete(tenant.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('tenants deleted successfully');
                        this.selectedCheckBox = null;
                        this.refreshtenants();
                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error('Some deletions failed');
                    }
                });
            }
        });
    }

    handleDelete(tenant: ITenant) {

        this.alert.confirm(
            `Do you want to delete "${tenant.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.tenantService.delete(tenant.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${tenant.name}" deleted successfully`
                    );

                    this.refreshTrigger.update(v => v + 1);
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${tenant.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(tenant: ITenant) {

        const action = tenant.isActive
            ? 'Deactivate'
            : 'Activate';

        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${tenant.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.tenantService.changeStatus(tenant.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${tenant.name}" ${action}d successfully`
                        );

                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${tenant.name}"`
                        );
                    }
                });

        });
    }


}
