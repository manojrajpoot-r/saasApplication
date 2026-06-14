
import { Component, OnInit, signal, ViewChild ,inject} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '@/app/core/services/admin/users/user';
import { AlertService } from '@/app/core/services/alert/alert';
import { BaseCrudComponent } from '@/app/shared/components/baseCrud/base-crud.component';
import { IUser } from '@/app/core/models/users/user.model';



import { ConfirmationService, MessageService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { RatingModule } from 'primeng/rating';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { InputIconModule } from 'primeng/inputicon';
import { IconFieldModule } from 'primeng/iconfield';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Product, ProductService } from '@/app/pages/service/product.service';
import { ReactiveFormsModule } from '@angular/forms';
interface Column {
    field: string;
    header: string;
    customExportHeader?: string;
}

interface ExportColumn {
    title: string;
    dataKey: string;
}
@Component({
    standalone:true,
     imports: [
        ReactiveFormsModule,
        CommonModule,
        TableModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        TextareaModule,
        SelectModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        TagModule,
        InputIconModule,
        IconFieldModule,
        ConfirmDialogModule
    ],
    selector: 'app-users',
    templateUrl: './users.html',
    styleUrl: './users.scss',
    providers: [MessageService, ProductService, ConfirmationService]
})
        
export class UsersComponent extends BaseCrudComponent<IUser> {
private fb = inject(FormBuilder);
 

    userDialog: boolean = false;
    users = signal<IUser[]>([]);
    user!: IUser;
    submitted: boolean = false;
    selectedUsers!: IUser[] | null;
  

  @ViewChild('dt') dt!: Table;

exportCSV() {
    this.dt.exportCSV();
}

    exportColumns!: ExportColumn[];

    cols!: Column[];

    constructor(
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private userService: UserService,
         private alert: AlertService
    ) {   super();}

   

 

 ngOnInit(): void {
        this.load();
    }

  
 onGlobalFilter(table: Table, event: Event) {

    table.filterGlobal(
        (event.target as HTMLInputElement).value,
        'contains'
    );
}
  openNew() {
    this.selectedId = null;

    this.user = {} as IUser;

    this.userForm.reset({
        fullName: '',
        email: '',
        password: ''
    });

    this.submitted = false;
    this.userDialog = true;
}

editUser(user: IUser) {
    this.user = { ...user };

    this.selectedId = user.id;

    this.userForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        password: ''
    });

    this.userDialog = true;
}

    deleteSelectedUsers() {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete the selected users?',
            header: 'Confirm',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.users.set(this.users().filter((val) => !this.selectedUsers?.includes(val)));
                this.selectedUsers = null;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Users Deleted',
                    life: 3000
                });
            }
        });
    }

    hideDialog() {
        this.userDialog = false;
        this.submitted = false;
    }

deleteUser(user: IUser) {

    this.confirmationService.confirm({

        message: 'Delete this user?',

        accept: () => {

            this.userService.delete(user.id)
                .subscribe(() => {

                    this.alert.success('Deleted');

                    this.load();
                });
        }
    });
}




  userForm = this.fb.nonNullable.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required]
    });

   
    load(): void {
        this.loading = true;
        this.userService.getAll()
            .subscribe({
              next: res => {
                     this.users.set(res.items   ); 
                    this.loading = false;
                },
                error: () => {
                    this.alert.error(
                        'Failed to load users'
                    );
                }
            });
    }

    edit(user: IUser): void {
        this.selectedId = user.id;
        this.userForm.patchValue(user);
    }

onUserSubmit(): void {

    this.submitted = true;

    if (this.userForm.invalid) {
        return;
    }

    const payload = this.userForm.getRawValue();

    const request$ = this.selectedId
        ? this.userService.update(this.selectedId, payload)
        : this.userService.create(payload);

    request$.subscribe({
        next: () => {

            this.alert.success(
                this.selectedId
                    ? 'User Updated Successfully'
                    : 'User Created Successfully'
            );

            this.userDialog = false;

            this.userForm.reset();

            this.selectedId = null;

            this.load();
        },
        error: () => {
            this.alert.error('Operation failed');
        }
    });
}

 

}
