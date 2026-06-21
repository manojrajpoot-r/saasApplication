
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
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
import { SubcriptionService } from '@/app/core/services/admin/subcriptions/subcription';
import { ISubcription } from '@/app/core/models/subcriptions/subcription.model';

import { PlanService } from '@/app/core/services/admin/plans/plan';
import { TenantService } from '@/app/core/services/admin/tenants/tenant';

import { IPlan } from '@/app/core/models/plans/plan.model';
import { ISubcriptionRequest } from '@/app/core/models/subcriptions/subcription.model';
import { IPlanRequest } from '@/app/core/models/plans/plan.model';
import { NgControl } from '@angular/forms';
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

    selector: 'app-subscriptions',
    templateUrl: './subscriptions.html',
    styleUrl: './subscriptions.scss',
    providers: [MessageService, ConfirmationService]
})



export class SubscriptionsComponent extends BaseCrudComponent<ISubcription> {
    private fb = inject(FormBuilder);
    private subcriptionService = inject(SubcriptionService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private router = inject(Router);
    private planService = inject(PlanService);
    private tenantService = inject(TenantService);
    handleDialog: boolean = false;
    subcription!: ISubcription;
    submitted: boolean = false;
    selectedCheckBox!: ISubcription[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Subcription Details";
    plans = signal<any[]>([]);
    tenants = signal<any[]>([]);

    ngOnInit(): void {
        this.loadPlan();
        this.loadTenant();
    }
    load(): void {
        // implementation
    }

    refreshplans(): void {
        this.search.set(this.search()); // re-trigger API
    }

    columns: TableColumn[] = [
        {
            field: 'tenantName',
            header: 'Tenant Name',
            sortable: true
        },

        {
            field: 'planName',
            header: 'Plan Name',
            sortable: true
        },

        {
            field: 'amount',
            header: 'Amount',
            sortable: true
        },

        {
            field: 'startDate',
            header: 'Start Date',
            sortable: true
        },

        {
            field: 'endDate',
            header: 'End Date',
            sortable: true
        },

        {
            field: 'subscriptionStatus',
            header: 'Subscription Status ',
            sortable: true,
            type: 'tag'
        }
    ];

    actions: TableAction[] = [
        {
            action: 'toggleStatus',
            icon: 'pi pi-power-off',
            severity: 'warn',
            tooltip: 'Toggle Status'

        },
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
            action: 'renewSubscription',
            icon: "pi pi-refresh",
            severity: 'contrast',
            tooltip: 'renewSubscription'
        },



    ];


    handleAction(event: ActionEvent<ISubcription>): void {
        const subcription = event.row;

        switch (event.action) {

            case 'toggleStatus':
                this.toggleStatus(subcription);
                break;
            case 'edit':
                this.handleEdit(subcription);
                break;

            case 'delete':
                this.handleDelete(subcription);
                break;

            case 'renewSubscription':
                this.renewSubscription(subcription.id);
                break;
        }
    }




    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }

    subscriptions = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.subcriptionService.getAll(1, 10, search)
            ),
            tap(res => {
                console.log('API Response:', res);
                console.log('Data:', res.data);
            }),
            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );

    loadPlan() {
        this.planService.getAll(1, 100, '').subscribe({
            next: (res: any) => {
                console.log('Plans:', res);
                this.plans.set(res.data || []);
            }
        });
    }

    loadTenant() {
        this.tenantService.getAll(1, 100, '').subscribe({
            next: (res: any) => {
                console.log('Tenants:', res);
                this.tenants.set(res.data || []);
            }
        });
    }





    handleForm = this.fb.nonNullable.group({
        tenantId: ['', Validators.required],
        planId: ['', Validators.required],
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

    handleEdit(subcription: ISubcription) {
        //console.log(subcription);
        this.isEditMode = true;
        this.selectedId = subcription.id;
        this.handleForm.patchValue({
            tenantId: subcription.tenantId,
            planId: subcription.planId,

        });
        this.handleDialog = true;
    }

    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const payload = this.handleForm.getRawValue();

        const req = this.selectedId
            ? this.subcriptionService.update(this.selectedId, payload)
            : this.subcriptionService.create(payload);

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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} plans ?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedCheckBox!.map(role =>
                    this.subcriptionService.delete(role.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('plans deleted successfully');
                        this.selectedCheckBox = null;
                        this.refreshplans();
                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error('Some deletions failed');
                    }
                });
            }
        });
    }

    handleDelete(subcription: ISubcription) {

        this.alert.confirm(
            `Do you want to delete "${subcription.tenantId}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.subcriptionService.delete(subcription.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${subcription.tenantId}" deleted successfully`
                    );

                    this.refreshTrigger.update(v => v + 1);
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${subcription.tenantId}"`
                    );
                }
            });

        });
    }

    toggleStatus(subcription: ISubcription) {

        const action = subcription.TenantSubscriptions
            ? 'Deactivate'
            : 'Activate';

        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${subcription.tenantId}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.subcriptionService.changeStatus(subcription.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${subcription.tenantId}" ${action}d successfully`
                        );

                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${subcription.tenantId}"`
                        );
                    }
                });

        });
    }

    renewSubscription(id: number) {
        if (confirm('Are you sure you want to renew this subscription?')) {
            this.subcriptionService.renewSubscription(id).subscribe({
                next: (res) => {
                    this.alert.success("Renew Subscription");

                    this.subscriptions();
                }
            });
        }
    }
}

