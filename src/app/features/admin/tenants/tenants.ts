
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { TenantService } from '@/app/core/services/admin/tenants/tenant';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { ITenant } from '@/app/core/models/tenants/tenant.model';
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
import { tap } from 'rxjs/operators';
import { combineLatest, of } from 'rxjs';
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

    tenantDialog: boolean = false;
    tenant!: ITenant;
    submitted: boolean = false;
    selectedTenants!: ITenant[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
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





    tenants = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.tenantService.getAllData(1, 10, search)
            ),
            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );
    // FORM
    tenantForm = this.fb.nonNullable.group({
        name: ['', Validators.required],
        subDomain: ['', Validators.required],
        adminName: ['', Validators.required],
        adminEmail: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });



    openNew() {
        this.isEditMode = false;
        this.selectedId = null;
        this.submitted = false;
        this.tenantForm.reset();
        this.tenantForm.controls.password.setValidators([Validators.required]);
        this.tenantForm.controls.password.updateValueAndValidity();
        this.tenantDialog = true;
    }
    hideDialog(): void {
        this.tenantDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.tenantForm.reset();
    }
    editTenant(tenant: any) {
        //console.log(tenant);
        this.isEditMode = true;
        this.selectedId = tenant.id;
        this.tenantForm.patchValue({
            name: tenant.name,
            subDomain: tenant.subDomain,

        });

        this.tenantForm.controls.password.clearValidators();
        this.tenantForm.controls.password.updateValueAndValidity();

        this.tenantDialog = true;
    }

    onTenantSubmit() {
        this.submitted = true;
        if (this.tenantForm.invalid) return;

        const payload = this.tenantForm.getRawValue();

        const req = this.selectedId
            ? this.tenantService.update(this.selectedId, payload)
            : this.tenantService.create(payload);

        req.subscribe({
            next: () => {
                this.alert.success('Saved Successfully');
                this.tenantDialog = false;
                this.refreshTrigger.update(v => v + 1);
            },
            error: (err) => {
                console.log(err);
                this.alert.error('Error');
            }
        });
    }
    refreshtenants(): void {
        this.search.set(this.search()); // re-trigger API
    }
    deleteselectedTenants(): void {

        if (!this.selectedTenants || this.selectedTenants.length === 0) return;

        this.confirm.confirm({
            message: `Are you sure you want to delete ${this.selectedTenants.length} tenants?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedTenants!.map(tenant =>
                    this.tenantService.delete(tenant.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('tenants deleted successfully');
                        this.selectedTenants = null;
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
    deleteTenant(tenant: any) {
        this.confirm.confirm({
            message: 'Delete tenant?',
            accept: () => {
                this.tenantService.delete(tenant.id).subscribe(() => {
                    this.alert.success('Deleted');
                    this.refreshTrigger.update(v => v + 1);
                });
            }
        });
    }

    toggleStatus(tenant: any) {
        this.tenantService.changeStatus(tenant.id, !tenant.isActive)
            .subscribe(() => {
                this.alert.success('Status Updated');
                this.refreshTrigger.update(v => v + 1);
            });
    }
}
