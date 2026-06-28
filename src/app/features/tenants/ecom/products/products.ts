
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IProduct, IProductRequest } from '@/app/core/models/Ecom/products/product.model';
import { ProductsService } from '@/app/core/services/admin/ecom/products/products';
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
import { single, switchMap, tap } from 'rxjs/operators';
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
import { CategoriesService } from '@/app/core/services/admin/ecom/categories/categories';
import { SubCategoriesService } from '@/app/core/services/admin/ecom/sub-categories/sub-categories';
import { BrandsService } from '@/app/core/services/admin/ecom/brands/brands';
import { Router } from '@angular/router';


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


    selector: 'app-products',
    templateUrl: './products.html',
    styleUrl: './products.scss',
    providers: [MessageService, ConfirmationService]
})



export class ProductComponent extends BaseCrudComponent<IProduct> {


    private fb = inject(FormBuilder);
    private productsService = inject(ProductsService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);
    private categoriesService = inject(CategoriesService);
    private subCategoriesService = inject(SubCategoriesService);
    private brandsService = inject(BrandsService);
    private router = inject(Router);

    private destroyRef = inject(DestroyRef);
    handleDialog: boolean = false;
    submitted: boolean = false;
    selectedCheckBox!: IProduct[] | null;
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "products Details"
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    categories = signal<any[]>([]);
    subCategories = signal<any[]>([]);
    brands = signal<any[]>([]);
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
        // this.loadSubCategories(),
        this.loadbrands()
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
            field: 'subCategoryName',
            header: 'Sub Category Name',
            sortable: true
        },

        {
            field: 'brandName',
            header: 'Brand Name',
            sortable: true
        },


        {
            field: 'name',
            header: 'Name',
            sortable: true
        },

        {
            field: 'price',
            header: 'Price',
            sortable: true
        },

        {
            field: 'discountPercentage',
            header: 'Discount Percentage',
            sortable: true
        },
        {
            field: 'discountPrice',
            header: 'Discount Price',
            sortable: true
        },
        {
            field: 'image',
            header: 'Product Image',
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

        {
           action: 'view',
            icon: 'pi pi-eye',
            severity: 'success',
            tooltip: 'Product Gallery',
            visible: true
        }

    ];

    handleAction(event: ActionEvent<IProduct>): void {
        const product = event.row;
        switch (event.action) {
            case 'edit':
                this.handleEdit(product);
                break;

            case 'delete':
                this.handleDelete(product);
                break;

            case 'toggleStatus':
                this.toggleStatus(product);
                break;

                case 'view':
                this.productGallary(product);
                break;
        }
    }

    productGallary(product: IProduct): void {
      this.router.navigate(['/tenant/product-gallery', product.id]);
    }
    


    products = toSignal(
        combineLatest([
            toObservable(this.search),
            toObservable(this.page),
            toObservable(this.pageSize),
            toObservable(this.refreshTrigger)
        ]).pipe(
            switchMap(([search, page, pageSize]) =>
                this.productsService.getAll(
                    page,
                    pageSize,
                    search
                )
            ),
            tap(res => {
                this.totalRecords.set(res.totalRecords);
                console.log('PrrData:', res.data);
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






    loadbrands() {
        this.brandsService
            .getDropdown()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res) => {
                    this.brands.set(res);

                }
            });
    }


    handleForm = this.fb.nonNullable.group({
        categoryId: this.fb.control<number | null>(null, Validators.required),
        subCategoryId: this.fb.control<number | null>(null, Validators.required),
        brandId: this.fb.control<number | null>(null, Validators.required),
        price: this.fb.control<string>('', Validators.required),
        discountPercentage: this.fb.control<string>('', Validators.required),

        quantity: this.fb.control<number | null>(null, Validators.required),
        name: this.fb.control<string>('', Validators.required),
        shortDescription: this.fb.control<string>(''),
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

    handleEdit(item: IProduct) {
        this.isEditMode = true;
        this.selectedId = item.id;

        // Pehle subcategories load karo
        this.subCategoriesService.getByCategory(Number(item.categoryId))
            .subscribe(res => {

                this.subCategories.set(res);

                // Phir form patch karo
                this.handleForm.patchValue({
                    categoryId: Number(item.categoryId),
                    subCategoryId: Number(item.subCategoryId),
                    brandId: Number(item.brandId),
                    price: item.price,
                    discountPercentage: item.discountPercentage,
                    quantity: Number(item.quantity),
                    name: item.name,
                    shortDescription: item.shortDescription,
                    description: item.description
                });
            });

        this.imagePreview = item.image
            ? `${this.BASE_URL}/${item.image}`
            : this.NO_IMAGE;

        this.handleDialog = true;
    }

    // onchange subcategory
    onCategoryChange(categoryId: number, isEdit = false) {
        this.subCategoriesService.getByCategory(categoryId)
            .subscribe(res => {
                this.subCategories.set(res);

                if (!isEdit) {
                    this.handleForm.patchValue({
                        subCategoryId: null
                    });
                }
            });
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
            'subCategoryId',
            this.handleForm.value.subCategoryId!.toString()
        );
        formData.append(
            'brandId',
            this.handleForm.value.brandId!.toString()
        );
        formData.append(
            'name',
            this.handleForm.value.name!
        );
        formData.append(
            'price',
            this.handleForm.value.price!
        );
        formData.append(
            'discountPercentage',
            this.handleForm.value.discountPercentage!
        );
        formData.append(
            'quantity',
            this.handleForm.value.quantity!.toString()
        );
        formData.append(
            'shortDescription',
            this.handleForm.value.shortDescription!
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
            ? this.productsService.update(
                this.selectedId,
                formData
            )
            : this.productsService.create(
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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} product?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCheckBox!.map(product =>
                    this.productsService.delete(product.id)
                );
                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('product deleted successfully');
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

    handleDelete(product: IProduct) {
        this.alert.confirm(
            `Do you want to delete "${product.name}"?`
        ).then(result => {
            if (!result.isConfirmed) {
                return;
            }
            this.productsService.delete(product.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${product.name}" deleted successfully`
                    );

                    this.refreshData();
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${product.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(product: IProduct) {
        const action = product.status
            ? 'Deactivate'
            : 'Activate';
        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${product.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.productsService.changeStatus(product.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${product.name}" ${action}d successfully`
                        );

                        this.refreshData();
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${product.name}"`
                        );
                    }
                });

        });
    }



}




