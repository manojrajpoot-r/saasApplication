
import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { TableColumn } from '../../models/table-column.model';
import { TableAction, ActionType, ActionEvent } from '../../models/table-action.model';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonSeverity } from 'primeng/button';
import { environment } from '@/app/environments/environment';
import { signal } from '@angular/core';
import { TablePageEvent } from 'primeng/table';
import { TextTransformPipe } from '../../pipes/text-transform-pipe';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { toSignal, toObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';

@Component({
    selector: 'app-base-table',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        TagModule,
        InputTextModule,
        InputIconModule,
        IconFieldModule,
        TooltipModule,
        TextTransformPipe

    ],
    templateUrl: './base-table.html',
    styleUrl: './base-table.scss'
})
export class BaseTableComponent<T> {


    @Output()
    pageChange = new EventEmitter<{
        page: number;
        pageSize: number;
    }>();

    onPageChange(event: TablePageEvent): void {

        const page = Math.floor((event.first ?? 0) / (event.rows ?? 10)) + 1;

        this.pageChange.emit({
            page: page,
            pageSize: event.rows ?? 10
        });
    }


    @ViewChild('dt')
    dt!: Table;

    @Input()
    data: T[] = [];

    @Input()
    columns: TableColumn[] = [];

    @Input()
    actions: TableAction[] = [];

    @Input()
    loading = false;

    @Input()
    totalRecords = 0;
    @Input() rows = 10;


    @Input()
    rowsPerPageOptions = [10, 20, 30];

    @Input()
    dataKey = 'id';

    @Input()
    selection: T[] = [];

    @Output()
    selectionChange = new EventEmitter<T[]>();

    @Output()
    search = new EventEmitter<string>();





    @Output()
    actionClick = new EventEmitter<ActionEvent<T>>();

    readonly BASE_URL = environment.apiUrlImage;
    readonly NO_IMAGE = 'http://localhost:4200/img/no-image.jpg';
    getImageUrl(path: string | null): string {

        if (!path) {
            return this.NO_IMAGE;
        }
        return `${this.BASE_URL}/${path}`;
    }

    onImageError(event: Event): void {
        const img = event.target as HTMLImageElement;
        if (!img.src.endsWith(this.NO_IMAGE)) {
            img.onerror = null;
            img.src = this.NO_IMAGE;
        }
    }

    onAction(action: ActionType, row: T): void {
        this.actionClick.emit({
            action,
            row
        });
    }





    private searchSubject = new Subject<string>();

    globalSearch = '';
    ngOnInit() {
        this.searchSubject.pipe(
            debounceTime(500),
            distinctUntilChanged()
        ).subscribe(value => {
            this.search.emit(value);
        });
    }

    onSearch(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        this.globalSearch = value;
        this.searchSubject.next(value);
    }





    exportCSV() {
        this.dt.columns =
            this.columns
                .filter(x => x.exportable !== false)
                .map(x => ({
                    field: x.field,
                    header: x.header
                })) as any;

        this.dt.exportCSV();
    }
}
