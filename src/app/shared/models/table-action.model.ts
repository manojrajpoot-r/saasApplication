export interface TableAction {
    action: 'edit' | 'delete' | 'toggleStatus' | 'assignPermission';
    icon: string;
    severity?: 'success' | 'info' | 'warning' | 'danger' | 'secondary';
}
