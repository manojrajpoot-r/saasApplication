export interface IPermission {
    id: number;
    name: string;
    groupName: string;
}

export interface IPermissionRequest {
    groupName: string;
    permissions: string[];
}
