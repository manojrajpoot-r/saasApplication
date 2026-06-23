export type ActionType =
    | 'edit'
    | 'delete'
    | 'toggleStatus'
    | 'assignPermission'
    | 'renewSubscription'
    | 'subscribe'
    |'passwordChange';

export type SeverityType =
    | 'secondary'
    | 'success'
    | 'info'
    | 'warn'
    | 'help'
    | 'danger'
    | 'contrast';


export interface TableAction {
    action: ActionType;
    icon: string;
    severity?: SeverityType;
    tooltip?: string;
    visible?: boolean;
    disabled?: boolean;
}

export interface ActionEvent<T> {
    action: ActionType;
    row: T;
}
