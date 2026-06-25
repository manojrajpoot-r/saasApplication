import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubCategoriesService } from '@/app/core/services/admin/ecom/sub-categories/sub-categories';
import { CategoriesService } from '@/app/core/services/admin/ecom/categories/categories';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { ISubCategory } from '@/app/core/models/Ecom/sub-category/sub-category.model';
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


    selector: 'app-sub-categories',
    templateUrl: './sub-categories.html',
    styleUrl: './sub-categories.scss',
    providers: [MessageService, ConfirmationService]
})



export class SubCategoryComponent extends BaseCrudComponent<ISubCategory> {


    private fb = inject(FormBuilder);
    private subcategoriesService = inject(SubCategoriesService);
    private categoriesService = inject(CategoriesService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);

    private destroyRef = inject(DestroyRef);
    handleDialog: boolean = false;
    submitted: boolean = false;
    selectedCheckBox!: ISubCategory[] | null;
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "category Details"
    categories = signal<any[]>([]);
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
        this.loadCategories();
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
            field: 'categoryName',
            header: 'Category Name',
            sortable: true
        },
        {
            field: 'name',
            header: 'Sub Category Name',
            sortable: true
        },

        {
            field: 'description',
            header: 'Description',
            sortable: true
        },
        {
            field: 'image',
            header: 'Sub Category Image',
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

    handleAction(event: ActionEvent<ISubCategory>): void {
        const category = event.row;
        switch (event.action) {
            case 'edit':
                this.handleEdit(category);
                break;

            case 'delete':
                this.handleDelete(category);
                break;

            case 'toggleStatus':
                this.toggleStatus(category);
                break;
        }
    }



    subcategories = toSignal(
        combineLatest([
            toObservable(this.search),
            toObservable(this.page),
            toObservable(this.pageSize),
            toObservable(this.refreshTrigger)
        ]).pipe(
            switchMap(([search, page, pageSize]) =>
                this.subcategoriesService.getAll(
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

    loadCategories() {
        this.categoriesService
            .getDropdown()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res) => {
                    this.categories.set(res);
                }
            });
    }


    handleForm = this.fb.nonNullable.group({
        categoryId: this.fb.control<number | null>(null, Validators.required),
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


    handleEdit(item: ISubCategory) {
        this.isEditMode = true;
        this.selectedId = item.id;
        this.handleForm.patchValue({
            categoryId: Number(item.categoryId),
            name: item.name,
            description: item.description
        });
        this.imagePreview = item.image
            ? `${this.BASE_URL}/${item.image}`
            : this.NO_IMAGE;

        this.handleDialog = true;
        console.log('Selected Category:', item.categoryId);
        console.log('Categories:', this.categories());
    }


    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;
        const formData = new FormData();
        formData.append(
            'categoryId',
            this.handleForm.value.categoryId!.toString()
        );
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
            ? this.subcategoriesService.update(
                this.selectedId,
                formData
            )
            : this.subcategoriesService.create(
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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} subcategory?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCheckBox!.map(subcategory =>
                    this.subcategoriesService.delete(subcategory.id)
                );
                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('subcategory deleted successfully');
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

    handleDelete(subcategory: ISubCategory) {
        this.alert.confirm(
            `Do you want to delete "${subcategory.name}"?`
        ).then(result => {
            if (!result.isConfirmed) {
                return;
            }
            this.subcategoriesService.delete(subcategory.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${subcategory.name}" deleted successfully`
                    );

                    this.refreshData();
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${subcategory.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(subcategory: ISubCategory) {
        const action = subcategory.status
            ? 'Deactivate'
            : 'Activate';
        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${subcategory.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.subcategoriesService.changeStatus(subcategory.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${subcategory.name}" ${action}d successfully`
                        );

                        this.refreshData();
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${subcategory.name}"`
                        );
                    }
                });

        });
    }



}


