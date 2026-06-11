import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

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
}
