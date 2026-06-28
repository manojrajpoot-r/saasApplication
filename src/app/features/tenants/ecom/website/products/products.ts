import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { GalleriaModule } from 'primeng/galleria';
import { ImageModule } from 'primeng/image';
import { TagModule } from 'primeng/tag';
import { ProductsService } from '@/app/core/services/admin/ecom/products/products';
import { IProduct } from '@/app/core/models/Ecom/products/product.model';
import { environment } from '@/app/environments/environment';
@Component({
    selector: 'app-products',
    standalone: true,
    imports: [
        CommonModule,
        CarouselModule,
        ButtonModule,
        GalleriaModule,
        ImageModule,
        TagModule
    ],
    templateUrl: './products.html',
    styleUrl: './products.scss',
    providers: [ProductsService]
})
export class Products implements OnInit {

    private productService = inject(ProductsService);

    products = signal<IProduct[]>([]);
    loading = signal(false);

    readonly BASE_URL = environment.apiUrlImage;
    readonly NO_IMAGE = 'http://ecom.saas.com:8080/img/no-image.jpg';

  
    galleriaResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 5
        },
        {
            breakpoint: '960px',
            numVisible: 4
        },
        {
            breakpoint: '768px',
            numVisible: 3
        },
        {
            breakpoint: '560px',
            numVisible: 1
        }
    ];

    carouselResponsiveOptions = [
        {
            breakpoint: '1024px',
            numVisible: 3,
            numScroll: 3
        },
        {
            breakpoint: '768px',
            numVisible: 2,
            numScroll: 2
        },
        {
            breakpoint: '560px',
            numVisible: 1,
            numScroll: 1
        }
    ];

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {

    console.log('loadProducts called');

    this.productService.getFeatures().subscribe({
      next: (res) => {
        console.log('API Success', res);
        this.products.set(res);
      },
      error: (err) => {
        console.error('API Error', err);
      },
      complete: () => {
        console.log('Completed');
      }
    });
  }

    getSeverity(status: string) {
        switch (status) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warn';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return 'success';
        }
    }
}