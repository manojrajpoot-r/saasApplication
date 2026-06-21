
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
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
import { NgControl } from '@angular/forms';
import { PaymentService } from '@/app/core/services/admin/paymentService/payment-service';
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

    ],


  selector: 'app-payment-history',
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.scss',

    providers: [MessageService, ConfirmationService]
})



export class PaymentHistoryComponent extends BaseCrudComponent<any> {
  
  
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private router = inject(Router);
    private PaymentService = inject(PaymentService);
    handleDialog: boolean = false;
    submitted: boolean = false;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Payment Details";
 

    load(): void {
        // implementation
    }

    refreshplans(): void {
        this.search.set(this.search()); // re-trigger API
    }

    columns: TableColumn[] = [
        {
            field: 'transactionId',
            header: 'Transaction ID',
            sortable: true
        },
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
            field: 'paymentGateway',
            header: 'Payment Gateway',
            sortable: true
        },
    
        {
            field: 'paymentDate',
            header: 'Payment Date',
            sortable: true
        },

        {
            field: 'paymentStatus',
            header: 'Payment Status',
            sortable: true,
            type: 'tag'
        }
    ];

    actions: TableAction[] = [
    
    ];





    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }

    payments = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.PaymentService.getAll(1, 10, search)
            ),
            tap(res => {
                console.log('API Response:', res);
                console.log('Data:', res.data);
            }),
            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );

 
  

  
}



