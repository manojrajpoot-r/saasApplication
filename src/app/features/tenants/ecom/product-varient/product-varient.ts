

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

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
import { SizesService } from '@/app/core/services/admin/ecom/sizes/sizes';
import { ColorsService } from '@/app/core/services/admin/ecom/colors/colors';
import { ProductsService } from '@/app/core/services/admin/ecom/products/products';
import { IProductVarient, IProductVarientRequest } from '@/app/core/models/Ecom/product-varient/product-varient.model';
import { ProducVarientService } from '@/app/core/services/admin/ecom/product-varient/produc-varient';
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

    selector: 'app-product-varient',
    templateUrl: './product-varient.html',
    styleUrl: './product-varient.scss',
    providers: [MessageService, ConfirmationService]
})



export class ProductVarientComponent extends BaseCrudComponent<IProductVarient> {


    private fb = inject(FormBuilder);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);
    private producVarientService = inject(ProducVarientService);
    private productService = inject(ProductsService);
    private colorsService = inject(ColorsService);
    private sizesService = inject(SizesService);

    private destroyRef = inject(DestroyRef);
    handleDialog: boolean = false;
    submitted: boolean = false;
    selectedCheckBox!: IProductVarient[] | null;
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "products Details"
    selectedFile: File | null = null;
    imagePreview: string | null = null;
    products = signal<any[]>([]);
    colors = signal<any[]>([]);
    sizes = signal<any[]>([]);
    page = signal(1);
    pageSize = signal(10);
    totalRecords = signal(0);
    private searchSubject = new Subject<string>();

    override load(): void {
        this.refreshData();
    }


    ngOnInit() {
        this.loadProducts();
        this.loadColors(),
            this.loadSizes()
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
            field: 'productName',
            header: 'Product Name',
            sortable: true
        },
        {
            field: 'colorName',
            header: 'Color Name',
            sortable: true
        },

        {
            field: 'sizeName',
            header: 'Size Name',
            sortable: true
        },

        {
            field: 'price',
            header: 'Price',
            sortable: true
        },

        {
            field: 'stock',
            header: 'Stock',
            sortable: true
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

    handleAction(event: ActionEvent<IProductVarient>): void {
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
        }
    }



    product_varients = toSignal(
        combineLatest([
            toObservable(this.search),
            toObservable(this.page),
            toObservable(this.pageSize),
            toObservable(this.refreshTrigger)
        ]).pipe(
            switchMap(([search, page, pageSize]) =>
                this.producVarientService.getAll(
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


    loadProducts() {
        this.productService
            .getDropdown()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res) => {
                    this.products.set(res);
                    console.log("dataress", res);

                }
            });
    }
    loadColors() {
        this.colorsService
            .getDropdown()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res) => {
                    this.colors.set(res);
                }
            });
    }

    loadSizes() {
        this.sizesService
            .getDropdown()
            .pipe(
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe({
                next: (res) => {
                    this.sizes.set(res);

                }
            });
    }

    hideDialog(): void {
        this.handleDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.handleForm.reset();
        this.resetForm();
    }

    openNew() {
        this.isEditMode = false;
        this.selectedId = null;
        this.submitted = false;
        this.handleForm.reset();
        this.resetForm();
        this.handleDialog = true;
    }

    handleForm = this.fb.nonNullable.group({
        productId: [0, Validators.required],
        colorId: [0, Validators.required],
        sizeId: [0, Validators.required],
        price: [0, Validators.required],
        stock: [0, Validators.required],
    });

    handleEdit(item: IProductVarient) {
        this.isEditMode = true;
        this.selectedId = item.id;
        this.handleForm.patchValue({
            productId: Number(item.productId),
            colorId: Number(item.colorId),
            sizeId: Number(item.sizeId),
            price: item.price,
            stock: item.stock

        });
        this.handleDialog = true;
    }


    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const payload = this.handleForm.getRawValue();

        const req = this.selectedId
            ? this.producVarientService.update(this.selectedId, payload)
            : this.producVarientService.create(payload);

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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} product?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                const deleteRequests = this.selectedCheckBox!.map(product =>
                    this.producVarientService.delete(product.id)
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

    handleDelete(product: IProductVarient) {
        this.alert.confirm(
            `Do you want to delete "${product.price}"?`
        ).then(result => {
            if (!result.isConfirmed) {
                return;
            }
            this.producVarientService.delete(product.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${product.price}" deleted successfully`
                    );

                    this.refreshData();
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${product.price}"`
                    );
                }
            });

        });
    }

    toggleStatus(product: IProductVarient) {
        const action = product.IsActive
            ? 'Deactivate'
            : 'Activate';
        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${product.price}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.producVarientService.changeStatus(product.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${product.price}" ${action}d successfully`
                        );

                        this.refreshData();
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${product.price}"`
                        );
                    }
                });

        });
    }



}





