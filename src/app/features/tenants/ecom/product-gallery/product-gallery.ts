

import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { BaseTableComponent } from '@/app/shared/components/base-table/base-table';
import { TableColumn } from '@/app/shared/models/table-column.model';
import { TableAction } from '@/app/shared/models/table-action.model';
import { Component, OnInit, ViewChild, inject, signal, ChangeDetectorRef, DestroyRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IProductGallery,IProductGalleryRequest } from '@/app/core/models/Ecom/product-gallaery/product-gallery.model';
import { ProductsService } from '@/app/core/services/admin/ecom/products/products';
import{ProducGallaryService} from '@/app/core/services/admin/ecom/product-gallary/produc-gallary';
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
import { Router } from '@angular/router';
import { IProduct } from '@/app/core/models/Ecom/products/product.model';
import { ActivatedRoute } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
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
        CardModule,
        TagModule,
    ],


  selector: 'app-product-gallery',
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.scss',
    providers: [MessageService, ConfirmationService]
})



export class ProductGalleryComponent extends BaseCrudComponent<IProductGallery> {


    private fb = inject(FormBuilder);
    private productsService = inject(ProductsService);
    private alert = inject(AlertService);
    private confirm = inject(ConfirmationService);
    private cdr = inject(ChangeDetectorRef);
    private producGallaryService = inject(ProducGallaryService);
    private router = inject(Router);
    private destroyRef = inject(DestroyRef);
    private route = inject(ActivatedRoute);
    handleDialog: boolean = false;
    submitted: boolean = false;
    selectedCheckBox!: IProductGallery[] | null;
    search = signal('');
    refreshTrigger = signal(0);
    isEditMode = false;
    header: string = "Products Gallery Details"
    selectedFiles: File[] = [];
    imagePreview: string | null = null;
    page = signal(1);
    pageSize = signal(10);
    totalRecords = signal(0);
    productId = 0;
    productImages = signal<IProductGallery[]>([]);
    private searchSubject = new Subject<string>();
    readonly BASE_URL = environment.apiUrlImage;
    readonly NO_IMAGE = 'http://localhost:4200/img/no-image.jpg';
    override load(): void {
        this.refreshData();
    }


ngOnInit() {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    this.handleForm.patchValue({
        productId: this.productId
    });

    this.loadProductGallaery();
}



loadProductGallaery() {
    const productId = Number(
        this.route.snapshot.paramMap.get('id')
    );

    this.producGallaryService
        .getByProductId(productId)
        .subscribe(res => {

            this.productImages.set(res.data);
            console.log(res.data);

        });

}

 



    private resetForm(): void {
        this.handleForm.reset();
        this.imagePreview = null;
        this.selectedFiles = [];
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
        const files = event.files;
        if (!files || files.length === 0) return;
        this.selectedFiles = [...files];
        const reader = new FileReader();
        reader.onload = () => {
            this.imagePreview = reader.result as string;
            this.cdr.detectChanges();
        };
        reader.readAsDataURL(this.selectedFiles[0]);
    }



        


openNew() {
    this.isEditMode = false;
    this.selectedId = null;
    this.submitted = false;
    this.handleForm.reset();
    this.handleForm.patchValue({
        productId: this.productId
    });
    this.resetForm();
    this.handleDialog = true;
}

hideDialog() {
    this.handleDialog = false;
    this.submitted = false;
    this.selectedId = null;
    this.handleForm.reset();
    this.handleForm.patchValue({
        productId: this.productId
    });
    this.resetForm();
}
  

         
    handleForm = this.fb.nonNullable.group({
        productId: this.fb.control<number | null>(null, Validators.required),
        imageUrl: this.fb.control<string>('', Validators.required),

    });


handleSubmit() {
    const productId = Number(this.route.snapshot.paramMap.get('id'));
    const formData = new FormData();

    formData.append(
        'productId',
        productId.toString()
    );

    this.selectedFiles.forEach(file => {
        formData.append('images', file);
    });

    this.producGallaryService
        .create(formData)
        .subscribe({
            next: () => {

                this.alert.success('Images Uploaded');
                this.handleDialog = false;
                this.resetForm();
                this.loadProductGallaery();
            },
            error: () => {
                this.alert.error('Something went wrong');
            }
        });

}
   
    handleDelete(item: IProductGallery) {
        this.alert.confirm(
            `Do you want to delete "${item.imageUrl}"?`
        ).then(result => {
            if (!result.isConfirmed) {
                return;
            }
            this.producGallaryService.delete(item.id).subscribe({
                next: () => {
                    this.alert.success(
                        `"${item.imageUrl}" deleted successfully`
                    );

                    this.refreshData();
                    this.loadProductGallaery();
                },
                error: () => {
                    this.alert.error(
                        `Failed to delete "${item.imageUrl}"`
                    );
                }
            });

        });
    }

   
    setPrimary(image: IProductGallery) {
        this.producGallaryService
            .setPrimary(image.id)
            .subscribe(() => {

                this.alert.success('Primary Image Updated');

                this.loadProductGallaery();

            });

    }


}





