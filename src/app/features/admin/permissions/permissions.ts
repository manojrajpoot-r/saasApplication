
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { PermissionService } from '@/app/core/services/admin/permissions/permission';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { IPermission } from '@/app/core/models/permissions/permission.model';
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

    selector: 'app-permissions',
    templateUrl: './permissions.html',
    styleUrl: './permissions.scss',
    providers: [MessageService, ConfirmationService]
})



export class PermissionsComponent extends BaseCrudComponent<IPermission> {
    private fb = inject(FormBuilder);
    private permissionService = inject(PermissionService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);

    handleDialog: boolean = false;
    permission!: IPermission;
    submitted: boolean = false;
    selectedCheckBox!: IPermission[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Permission Details";

    columns: TableColumn[] = [
        {
            field: 'name',
            header: 'Name',
            sortable: true
        },

        {
            field: 'groupName',
            header: 'Group Name',
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

    refreshpermissions(): void {
        this.search.set(this.search()); // re-trigger API
    }

    handleAction(event: { action: string; row: IPermission; }) {

        const permission = event.row;

        switch (event.action) {

            case 'edit':
                this.handleEdit(permission);
                break;

            case 'delete':
                this.handleDelete(permission);
                break;


        }
    }

    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }



    permissions = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),

            switchMap(({ search }) =>
                this.permissionService.getAll(1, 10, search)
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
        groupName: ['', Validators.required],

        permissions: this.fb.array([
            this.fb.control('', Validators.required)
        ]),
    });

    get permissionsArray(): FormArray {
        return this.handleForm.get('permissions') as FormArray;
    }


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

    handleEdit(permission: IPermission) {
        this.isEditMode = true;
        this.selectedId = permission.id;

        // 1. clear old array
        this.permissionsArray.clear();

        // 2. add API value
        this.permissionsArray.push(
            this.fb.control(permission.name, Validators.required)
        );

        // 3. group set
        this.handleForm.patchValue({
            groupName: permission.groupName
        });

        this.handleDialog = true;
    }

    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const formValue = this.handleForm.getRawValue();

        const payload = {
            groupName: formValue.groupName,
            permissions: this.permissionsArray.value
        };

        const req = this.selectedId
            ? this.permissionService.update(this.selectedId, payload)
            : this.permissionService.create(payload);

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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} permissions?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedCheckBox!.map(permission =>
                    this.permissionService.delete(permission.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('permissions deleted successfully');
                        this.selectedCheckBox = null;
                        this.refreshpermissions();
                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error('Some deletions failed');
                    }
                });
            }
        });
    }

    handleDelete(permission: IPermission) {

        this.alert.confirm(
            `Do you want to delete "${permission.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.permissionService.delete(permission.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${permission.name}" deleted successfully`
                    );

                    this.refreshTrigger.update(v => v + 1);
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${permission.name}"`
                    );
                }
            });

        });
    }




}
