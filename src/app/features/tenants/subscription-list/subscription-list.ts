
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


  selector: 'app-subscription-list',
  templateUrl: './subscription-list.html',
  styleUrl: './subscription-list.scss',

    providers: [MessageService, ConfirmationService]
})



export class SubscriptionListComponent extends BaseCrudComponent<ISubcription> {
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
            action: 'renewSubscription',
            icon: "pi pi-refresh",
            severity: 'contrast',
            tooltip: 'renewSubscription'
        },



    ];


    handleAction(event: ActionEvent<ISubcription>): void {
        const subcription = event.row;

        switch (event.action) {

           
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


