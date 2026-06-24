
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, signal, ViewChild, inject, computed, } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CategoriesService } from '@/app/core/services/admin/ecom/categories/categories';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { ICategory } from '@/app/core/models/Ecom/categories/category.model';
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
    ],


    selector: 'app-categories',
    templateUrl: './categories.html',
    styleUrl: './categories.scss',
    providers: [MessageService, ConfirmationService]
})



export class CategoryComponent extends BaseCrudComponent<ICategory> {
    private fb = inject(FormBuilder);
    private categoriesService = inject(CategoriesService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private router = inject(Router);
    handleDialog: boolean = false;
    category!: ICategory;
    submitted: boolean = false;
    selectedCheckBox!: ICategory[] | null;
    private destroy$ = new Subject<void>();
    private searchSubject = new Subject<string>();
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "category Details"

    load(): void {
        // implementation
    }

    refreshcategorys(): void {
        this.search.set(this.search()); // re-trigger API
    }

    columns: TableColumn[] = [
        {
            field: 'name',
            header: 'Category Name',
            sortable: true
        },

        {
            field: 'description',
            header: 'Description',
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


    handleAction(event: ActionEvent<ICategory>): void {
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

    categories = toSignal(
        toObservable(
            computed(() => ({
                search: this.search(),
                refresh: this.refreshTrigger()
            }))
        ).pipe(
            debounceTime(300),
            switchMap(({ search }) =>
                this.categoriesService.getAll(1, 10, search)
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
        name: ['', Validators.required],
        description: ['', Validators.required],
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

    handleEdit(category: ICategory) {
        //console.log(category);
        this.isEditMode = true;
        this.selectedId = category.id;
        this.handleForm.patchValue({
            name: category.name,
        });
        this.handleForm.patchValue({
            description: category.description,
        });
        this.handleDialog = true;
    }

    handleSubmit() {
        this.submitted = true;
        if (this.handleForm.invalid) return;

        const payload = this.handleForm.getRawValue();

        const req = this.selectedId
            ? this.categoriesService.update(this.selectedId, payload)
            : this.categoriesService.create(payload);

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
            message: `Are you sure you want to delete ${this.selectedCheckBox.length} categorys?`,
            header: 'Confirm Delete',
            icon: 'pi pi-exclamation-triangle',

            accept: () => {

                const deleteRequests = this.selectedCheckBox!.map(category =>
                    this.categoriesService.delete(category.id)
                );

                forkJoin(deleteRequests).subscribe({
                    next: () => {
                        this.alert.success('categorys deleted successfully');
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

    handleDelete(category: ICategory) {

        this.alert.confirm(
            `Do you want to delete "${category.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.categoriesService.delete(category.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${category.name}" deleted successfully`
                    );

                    this.refreshTrigger.update(v => v + 1);
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${category.name}"`
                    );
                }
            });

        });
    }

    toggleStatus(category: ICategory) {

        const action = category.status
            ? 'Deactivate'
            : 'Activate';

        this.alert.confirm(
            `Do you want to ${action.toLowerCase()} "${category.name}"?`
        ).then(result => {

            if (!result.isConfirmed) {
                return;
            }

            this.categoriesService.changeStatus(category.id)
                .subscribe({
                    next: () => {

                        this.alert.success(
                            `"${category.name}" ${action}d successfully`
                        );

                        this.refreshTrigger.update(v => v + 1);
                    },
                    error: () => {
                        this.alert.error(
                            `Failed to ${action.toLowerCase()} "${category.name}"`
                        );
                    }
                });

        });
    }


}

