
import { Component, signal, inject } from '@angular/core';
import { PlanService } from '@/app/core/services/admin/plans/plan';
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { ActionType } from '@/app/shared/models/table-action.model';
import { ActionEvent } from '@/app/shared/models/table-action.model';
import { IPlan } from '@/app/core/models/plans/plan.model';
import { AlertService } from '@/app/core/services/alert/alert';
import { PaymentService } from '@/app/core/services/admin/paymentService/payment-service';
import { FormBuilder, Validators } from '@angular/forms';
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
import { CardModule } from 'primeng/card';




declare var Razorpay: any;
@Component({
    selector: 'app-plan-list',
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
        CardModule
    ],
    templateUrl: './plan-list.html',
    styleUrl: './plan-list.scss',
})

export class PlanListComponent {

    private planService = inject(PlanService);
    private paymentService = inject(PaymentService);
    private alert = inject(AlertService)
    plans = signal<any[]>([]);
    search = signal('');
    ngOnInit() {
        this.loadPlan();
    }

    loadPlan() {
        this.planService.getAll(1, 100, '').subscribe({
            next: (res: any) => {
                this.plans.set(res.data || []);
            }
        });
    }



    subscribePlan(planId: number) {
        console.log('PlanId =>', planId);

        this.paymentService.createOrder(planId).subscribe({
            next: (res: any) => {

                console.log('Response =>', res);

                if (!res.success) {
                    this.alert.error(res.message);
                    return;
                }

                const order = res.data;

                const options = {
                    key: order.key,
                    amount: order.amount * 100,
                    currency: 'INR',
                    order_id: order.orderId,

                    name: 'My SaaS',
                    description: 'Subscription Payment',

                    handler: (response: any) => {

                        this.paymentService.verifyPayment({
                            transactionId: response.razorpay_order_id,

                            success: true
                        }).subscribe(() => {

                            this.alert.success('Payment Success');

                        });
                    }
                };

                new Razorpay(options).open();
            }
        });
    }

}
