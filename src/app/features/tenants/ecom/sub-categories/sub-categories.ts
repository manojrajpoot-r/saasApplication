
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SubCategoriesService } from '@/app/core/services/admin/ecom/sub-categories/sub-categories';
import { CategoriesService } from '@/app/core/services/admin/ecom/categories/categories';
import { ImageModule } from 'primeng/image';
import { SkeletonModule } from 'primeng/skeleton';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { ISubCategory } from '@/app/core/models/Ecom/sub-category/sub-category.model';
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
import { Signal } from '@angular/core';
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
    private router = inject(Router);
    handleDialog: boolean = false;
    subcategory!: ISubCategory;
    submitted: boolean = false;
    selectedCheckBox!: ISubCategory[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "category Details"
    categories = signal<any[]>([]);
    selectedFile: File | null = null;
    imagePreview: string | ArrayBuffer | null = null;



    override load(): void {
        this.refreshTrigger.update(v => v + 1);
    }
    ngOnInit() {
        this.loadCatgories();
    }

    refreshcategorys(): void {
        this.search.set(this.search());
    }




    imageLoadingMap: Record<number, boolean> = {};

    onImageLoad(id: number): void {
        this.imageLoadingMap[id] = false;
    }

    onImageStart(id: number): void {
        this.imageLoadingMap[id] = true;
    }

    onImageError(event: Event): void {
        (event.target as HTMLImageElement).src =
            'assets/no-image.png';
    }
    onFileSelected(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        this.selectedFile = file;

        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
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





    onSearch(event: Event) {
        this.search.set((event.target as HTMLInputElement).value);
    }

    subcategories = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.subcategoriesService.getAll(1, 10, search)
            ),
            tap(res => {
                console.log('API Response:', res);
                console.log('Data:', res.data);
            }),
            map(res => res.data ?? [])
        ),
        { initialValue: [] }
    );



    loadCatgories() {
        this.categoriesService.getAll(1, 100, '').subscribe({
            next: (res: any) => {
                this.categories.set(res.data || []);
                console.log(res.data);
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
        this.handleDialog = true;
    }

    hideDialog(): void {
        this.handleDialog = false;
        this.submitted = false;
        this.selectedId = null;
        this.handleForm.reset();
    }

    handleEdit(subcategory: ISubCategory) {

        this.isEditMode = true;
        this.selectedId = subcategory.id;

        this.handleForm.patchValue({
            categoryId: subcategory.categoryId ?? null,
            name: subcategory.name,
            description: subcategory.description ?? ''
        });



        this.handleDialog = true;
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
                this.refreshTrigger.update(v => v + 1);
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
                        this.refreshcategorys();
                        this.refreshTrigger.update(v => v + 1);
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

                    this.refreshTrigger.update(v => v + 1);
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

                        this.refreshTrigger.update(v => v + 1);
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


