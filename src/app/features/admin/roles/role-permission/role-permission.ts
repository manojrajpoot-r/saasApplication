import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CheckboxChangeEvent } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { TagModule } from 'primeng/tag';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PermissionService } from '@/app/core/services/admin/permissions/permission';
import { RoleService } from '@/app/core/services/admin/roles/role';
import { ChangeDetectorRef } from '@angular/core';
import { AlertService } from '@/app/core/services/alert/alert';
import { Router } from '@angular/router';
import { AssignRolePermissionService } from '@/app/core/services/admin/assign-role-permission/assign-role-permission';
@Component({
    selector: 'app-role-permission',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CheckboxModule,
        PanelModule,
        TagModule,
        ProgressSpinnerModule

    ],
    templateUrl: './role-permission.html',
    styleUrl: './role-permission.scss',
})
export class RolePermissionComponent implements OnInit {

    roleName: string = '';
    roleId: number = 0;
    permissions: any[] = [];
    loading = false;

    constructor(
        private route: ActivatedRoute,
        private permissionService: PermissionService,
        private assignRolePermissionService: AssignRolePermissionService,
        private roleService: RoleService,
        private cdr: ChangeDetectorRef,
        private alert: AlertService,
        private router: Router
    ) { }

    ngOnInit(): void {

        this.route.paramMap.subscribe(params => {
            this.roleId = Number(params.get('id'));
            this.loadRole();
            this.loadData();

        });

    }

    loadData(): void {

        this.loading = true;

        this.permissionService
            .getAll(1, 1000, '')
            .subscribe({
                next: (res) => {

                    console.log('Permissions', res);

                    const grouped: Record<string, any[]> = {};

                    res.data.forEach(item => {

                        if (!grouped[item.groupName]) {
                            grouped[item.groupName] = [];
                        }

                        grouped[item.groupName].push({
                            id: item.id,
                            name: item.name,
                            checked: false
                        });

                    });

                    this.permissions = Object.keys(grouped)
                        .map(groupName => ({
                            groupName,
                            items: grouped[groupName]
                        }));

                    console.log(this.permissions);

                    this.loadAssignedPermissions();
                },

                error: err => {

                    console.error(err);

                    this.loading = false;
                }
            });
    }

    loadRole() {
        this.roleService.getById(this.roleId)
            .subscribe({
                next: (res: any) => {
                    this.roleName = res.name;
                    // ya agar API wrapper bhej rahi hai:
                    this.roleName = res.data?.name;
                },
                error: (err) => {
                    console.log(err);
                }
            });

    }

    loadAssignedPermissions() {
        this.assignRolePermissionService
            .getRolePermissions(this.roleId)
            .subscribe({
                next: (res: any) => {
                    const assignedPermissions =
                        (res?.data || [])
                            .map((x: string) =>
                                x.trim().toLowerCase()
                            );

                    this.permissions.forEach(group => {
                        group.items.forEach((item: any) => {
                            item.checked =
                                assignedPermissions.includes(
                                    item.name.trim().toLowerCase()
                                );

                        });

                    });
                    this.loading = false;
                    this.cdr.detectChanges();
                },
                error: (err) => {
                    console.log('Permission Error:', err);
                    this.loading = false;
                    this.cdr.detectChanges();
                }
            });

    }

    savePermissions() {
        const selectedPermissions = this.permissions
            .flatMap(group =>
                group.items
                    .filter((x: any) => x.checked)
                    .map((x: any) => x.id)
            );
        const payload = {
            roleId: this.roleId,
            permissionIds: selectedPermissions

        };
        this.assignRolePermissionService.assignPermission(payload)
            .subscribe({
                next: (res: any) => {
                    this.alert.success('Permissions Assigned Successfully!')
                    this.router.navigate(['/admin/roles']);
                },
                error: (err) => {
                    this.alert.error(err);
                    console.log(err);
                }
            });
    }

    isAllSelected(items: any[]): boolean {
        return items.every(x => x.checked);
    }

    toggleGroup(
        items: any[],
        event: CheckboxChangeEvent
    ): void {

        const checked = event.checked ?? false;

        items.forEach(item => {
            item.checked = checked;
        });
    }

}
