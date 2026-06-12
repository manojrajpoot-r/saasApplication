import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import Swal from 'sweetalert2';
@Injectable({
    providedIn: 'root'
})
export class AlertService {

    constructor(private msgService: MessageService) { }

    success(message: string, summary: string = 'Success') {
        this.msgService.add({
            severity: 'success',
            summary,
            detail: message
        });
    }

    error(message: string, summary: string = 'Error') {
        this.msgService.add({
            severity: 'error',
            summary,
            detail: message
        });
    }

    warning(message: string, summary: string = 'Warning') {
        this.msgService.add({
            severity: 'warn',
            summary,
            detail: message
        });
    }

    info(message: string, summary: string = 'Info') {
        this.msgService.add({
            severity: 'info',
            summary,
            detail: message
        });
    }

    clear() {
        this.msgService.clear();
    }

    confirm(message: string) {
        return Swal.fire({
            title: 'Are you sure?',
            text: message,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No'
        });
    }
}
