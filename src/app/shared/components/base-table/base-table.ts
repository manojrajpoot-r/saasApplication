
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
import { TableAction } from '../../models/table-action.model';

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
        IconFieldModule
    ],
    templateUrl: './base-table.html',
    styleUrl: './base-table.scss'
})
export class BaseTableComponent<T> {

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

    @Input()
    rows = 10;

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
    pageChange = new EventEmitter<any>();

    @Output()
    actionClick = new EventEmitter<{
        action: string;
        row: T;
    }>();

    globalSearch = '';

    onSearch(event: Event) {

        const value =
            (event.target as HTMLInputElement).value;

        this.globalSearch = value;

        this.search.emit(value);
    }

    onAction(
        action: string,
        row: T
    ) {

        this.actionClick.emit({
            action,
            row
        });
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
