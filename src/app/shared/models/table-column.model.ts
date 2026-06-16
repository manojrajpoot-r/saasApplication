
export interface TableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    exportable?: boolean;
    type?: 'text' | 'tag';
}
