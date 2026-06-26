
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SizesService } from '@/app/core/services/admin/ecom/sizes/sizes';
import { ISize, ISizeRequest } from '@/app/core/models/Ecom/sizes/size.model';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';

import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ReactiveFormsModule } from '@angular/forms';
import { FormErrorDirective } from '@/app/shared/validation/form-error.directive';
import { ValidationSummaryComponent } from '@/app/shared/validation/validation-summary.component';
import { forkJoin } from 'rxjs';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs/operators';
import { combineLatest, } from 'rxjs';
import { ActionEvent } from '@/app/shared/models/table-action.model';
import { environment } from '@/app/environments/environment';
import { ProgressSpinner } from 'primeng/progressspinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EventEmitter } from '@angular/core';
import { map } from 'rxjs/operators';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CapitalizePipePipe } from '@/app/shared/pipes/capitalize-pipe-pipe';
import { Subject } from 'rxjs';

@Component({
    standalone: true,
    imports: [

        SkeletonModule,
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
        FileUploadModule,
        ProgressSpinner,
        CapitalizePipePipe,
    ],

    selector: 'app-sizes',
    templateUrl: './sizes.html',
    styleUrl: './sizes.scss',
    providers: [MessageService, ConfirmationService]
})



export class SizeComponent extends BaseCrudComponent<ISize> {


    private fb = inject(FormBuilder);
    private sizeservice = inject(SizesService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);
    private destroyRef = inject(DestroyRef);
    handleDialog: boolean = false;
    submitted: boolean = false;
    selectedCheckBox!: ISize[] | null;
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Size Details"
    categories = signal<any[]>([]);
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    page = signal(1);
    pageSize = signal(10);
    totalRecords = signal(0);
    private searchSubject = new Subject<string>();

    override load(): void {
        this.refreshData();
    }


    ngOnInit() {

    }

    onSearch(value: string) {
        this.search.set(value);
    }
    onPageChange(event: { page: number; pageSize: number; }) {
        this.page.set(event.page);
        this.pageSize.set(event.pageSize);
    }

    private resetForm(): void {
        this.handleForm.reset();
        this.imagePreview = null;
        this.selectedFile = null;
    }

    private refreshData(): void {
        this.refreshTrigger.update(v => v + 1);
    }

    columns: TableColumn[] = [
        {
            field: 'name',
            header: 'Size Name',
            sortable: true
        },

        {
            field: 'IsFeatured',
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

    handleAction(event: ActionEvent<ISize>): void {
        const size = event.row;
        switch (event.action) {
            case 'edit':
                this.handleEdit(size);
                break;

            case 'delete':
                this.handleDelete(size);
                break;

            case 'toggleStatus':
                this.toggleStatus(size);
                break;
        }
    }



    sizes = toSignal(
        combineLatest([
            toObservable(this.search),
            toObservable(this.page),
            toObservable(this.pageSize),
            toObservable(this.refreshTrigger)
        ]).pipe(
            switchMap(([search, page, pageSize]) =>
                this.sizeservice.getAll(
                    page,
                    pageSize,
                    search
                )
            ),

            tap(res => {

                this.totalRecords.set(
                    res.totalRecords
                );

            }),

            map(res => res.data ?? [])

        ),
        {
            initialValue: []
        }
    );



    handleForm = this.fb.nonNullable.group({
        name: ['', Validators.required],

    });

    openNew() {
        this.isEditMode = false;
        this.selectedId = null;
        this.submitted = false;
        this.handleForm.reset();
        this.resetForm();
        this.handleDialog = true;
    }

    hideDialog(): void {
        this.handleDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.handleForm.reset();
        this.resetForm();
    }


    handleEdit(item: ISize) {
        this.isEditMode = true;
        this.selectedId = item.id;
        this.handleForm.patchValue({
            name: item.name,
        });
        this.handleDialog = true;
    }


    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const payload = this.handleForm.getRawValue();

        const req = this.selectedId
            ? this.sizeservice.update(this.selectedId, payload)
            : this.sizeservice.create(payload);

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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} size?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCheckBox!.map(size =>
                    this.sizeservice.delete(size.id)
                );
                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('size deleted successfully');
                        this.selectedCheckBox = null;
                        this.refreshData();

                    },
                    error: () => {
                        this.alert.error('Some deletions failed');
                    }
                });
            }
        });
    }

    handleDelete(size: ISize) {
        this.alert.confirm(
            `Do you want to delete "${size.name}"?`
        ).then(result => {
            if (!result.isConfirmed) {
                return;
            }
            this.sizeservice.delete(size.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${size.name}" deleted successfully`
                    );

                    this.refreshData();
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${size.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(size: ISize) {
        const action = size.IsFeatured
            ? 'Deactivate'
            : 'Activate';
        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${size.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.sizeservice.changeStatus(size.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${size.name}" ${action}d successfully`
                        );

                        this.refreshData();
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${size.name}"`
                        );
                    }
                });

        });
    }



}



