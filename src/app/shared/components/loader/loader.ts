import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '@/app/core/services/loading/loading';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';
@Component({
    selector: 'app-loader',
    standalone: true,
    imports: [CommonModule],
    styleUrl: './loader.scss',
    template: `
    <div *ngIf="loading$ | async" class="loader-backdrop">
      Loading...
    </div>
  `
})
export class Loader {

    private loadingService = inject(LoadingService);

    loading$ = this.loadingService.loading$;
}
