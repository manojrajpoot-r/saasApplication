
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
import { PlanService } from '@/app/core/services/admin/plans/plan';
import { IPlan } from '@/app/core/models/plans/plan.model';
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

  selector: 'app-plans',
  templateUrl: './plans.html',
  styleUrl: './plans.scss',
    providers: [MessageService, ConfirmationService]
})



export class PlansComponent extends BaseCrudComponent<IPlan>  {
    private fb = inject(FormBuilder);
    private planService = inject(PlanService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private router = inject(Router);
    handleDialog: boolean = false;
    plan!: IPlan;
    submitted: boolean = false;
    selectedCheckBox!: IPlan[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Plan Details"

    load(): void {
        // implementation
    }

    refreshplans(): void {
        this.search.set(this.search()); // re-trigger API
    }

    columns: TableColumn[] = [
        {
            field: 'name',
            header: 'Plan Name',
            sortable: true
        },

        {
            field: 'price',
            header: 'Price',
            sortable: true
        },
       {
            field: 'maxUsers',
            header: 'Max Users',
            sortable: true
        },

           {
            field: 'durationInMonths',
            header: 'Duration (Months)',
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
    
    ];


    handleAction(event: ActionEvent<IPlan>): void {
        const plan = event.row;

        switch (event.action) {
           

            case 'edit':
                this.handleEdit(plan);
                break;

            case 'delete':
                this.handleDelete(plan );
                break;

            case 'toggleStatus':
                this.toggleStatus(plan);
                break;
        }
    }




    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }

    plans = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.planService.getAll(1, 10, search)
            ),
            tap(res => {
                console.log('API Response:', res);
                console.log('Data:', res.data);
            }),
            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );

    handleForm = this.fb.nonNullable.group({
        name: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        durationInMonths: [1, [Validators.required, Validators.min(1)]],
        maxUsers: [1, [Validators.required, Validators.min(1)]]

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

    handleEdit(plan: IPlan) {
        //console.log(plan);
        this.isEditMode = true;
        this.selectedId = plan.id;
        this.handleForm.patchValue({
            name: plan.name,
            price: plan.price,
            durationInMonths: plan.durationInMonths,
            maxUsers: plan.maxUsers
        });
        this.handleDialog = true;
    }

    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const payload = this.handleForm.getRawValue();

        const req = this.selectedId
            ? this.planService.update(this.selectedId, payload)
            : this.planService.create(payload);

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
                    this.planService.delete(role.id)
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

    handleDelete(plan: IPlan) {

        this.alert.confirm(
            `Do you want to delete "${plan.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.planService.delete(plan.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${plan.name}" deleted successfully`
                    );

                    this.refreshTrigger.update(v => v + 1);
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${plan.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(plan: IPlan) {

        const action = plan.isActive
            ? 'Deactivate'
            : 'Activate';

        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${plan.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.planService.changeStatus(plan.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${plan.name}" ${action}d successfully`
                        );

                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${plan.name}"`
                        );
                    }
                });

        });
    }

 
}
