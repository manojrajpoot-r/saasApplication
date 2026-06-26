
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BrandsService } from '@/app/core/services/admin/ecom/brands/brands';
import { ImageModule } from 'primeng/image';
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
import { IBrand } from '@/app/core/models/Ecom/brands/brand.model';

@Component({
    standalone: true,
    imports: [
        ImageModule,
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


      selector: 'app-brands',
      templateUrl: './brands.html',
      styleUrl: './brands.scss',
    providers: [MessageService, ConfirmationService]
})



export class BrandComponent extends BaseCrudComponent<IBrand> {


    private fb = inject(FormBuilder);
    private brandsService = inject(BrandsService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    private destroyRef = inject(DestroyRef);
    handleDialog: boolean = false;
    submitted: boolean = false;
    selectedCheckBox!: IBrand[] | null;
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Brands Details"
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    page = signal(1);
    pageSize = signal(10);
    totalRecords = signal(0);
    private searchSubject = new Subject<string>();
    readonly BASE_URL = environment.apiUrlImage;
    readonly NO_IMAGE = 'http://localhost:4200/img/no-image.jpg';
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

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (!img.src.includes('no-image.png')) {
            img.src = this.NO_IMAGE;
        }
    }

    onFileSelect(event: any) {
        const file = event.files[0];
        if (!file) return;
        this.selectedFile = file;
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(file);
    }

    columns: TableColumn[] = [

      
        {
            field: 'name',
            header: 'Name',
            sortable: true
        },

        {
            field: 'description',
            header: 'Description',
            sortable: true
        },
        {
            field: 'image',
            header: 'brand Image',
            sortable: true,
            type: 'image'
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

    handleAction(event: ActionEvent<IBrand>): void {
        const brand = event.row;
        switch (event.action) {
            case 'edit':
                this.handleEdit(brand);
                break;

            case 'delete':
                this.handleDelete(brand);
                break;

            case 'toggleStatus':
                this.toggleStatus(brand);
                break;
        }
    }



    brands = toSignal(
        combineLatest([
            toObservable(this.search),
            toObservable(this.page),
            toObservable(this.pageSize),
            toObservable(this.refreshTrigger)
        ]).pipe(
            switchMap(([search, page, pageSize]) =>
                this.brandsService.getAll(
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
        name: this.fb.control<string>('', Validators.required),
        description: this.fb.control<string>(''),
        image: this.fb.control<string | null>(null)
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


    handleEdit(item: IBrand) {
        this.isEditMode = true;
        this.selectedId = item.id;
        this.handleForm.patchValue({
            name: item.name,
            description: item.description
        });
        this.imagePreview = item.image
            ? `${this.BASE_URL}/${item.image}`
            : this.NO_IMAGE;

        this.handleDialog = true;
    }


    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;
        const formData = new FormData();
        formData.append(
            'name',
            this.handleForm.value.name!
        );
        formData.append(
            'description',
            this.handleForm.value.description!
        );
        if (this.selectedFile) {
            formData.append(
                'image',
                this.selectedFile
            );
        }

        const req = this.selectedId
            ? this.brandsService.update(
                this.selectedId,
                formData
            )
            : this.brandsService.create(
                formData
            );
        req.subscribe({
            next: () => {
                this.alert.success('Saved Successfully');
                this.handleDialog = false;
                this.refreshData();
                this.resetForm();
                this.imagePreview = null;
                this.selectedFile = null;
            },
            error: () => {
                this.alert.error('Something went wrong');
            }
        });
    }

    handleDeleteselected(): void {
        if (!this.selectedCheckBox || this.selectedCheckBox.length === 0) return;
        this.confirm.confirm({
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} brand?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCheckBox!.map(brand =>
                    this.brandsService.delete(brand.id)
                );
                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('brand deleted successfully');
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

    handleDelete(brand: IBrand) {
        this.alert.confirm(
            `Do you want to delete "${brand.name}"?`
        ).then(result => {
            if (!result.isConfirmed) {
                return;
            }
            this.brandsService.delete(brand.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${brand.name}" deleted successfully`
                    );

                    this.refreshData();
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${brand.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(brand: IBrand) {
        const action = brand.status
            ? 'Deactivate'
            : 'Activate';
        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${brand.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.brandsService.changeStatus(brand.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${brand.name}" ${action}d successfully`
                        );

                        this.refreshData();
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${brand.name}"`
                        );
                    }
                });

        });
    }



}



