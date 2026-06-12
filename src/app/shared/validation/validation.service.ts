import { Injectable } from '@angular/core';
import messagesRaw from './validation-messages.json';
import { ValidationMessages } from './validation.model';

const messages = messagesRaw as ValidationMessages;

@Injectable({ providedIn: 'root' })
export class ValidationService {

    currentLang: 'en' | 'hi' = 'en';

    getMessage(errorKey: string, field: string, value?: any): string {

        const msgSet = messages[this.currentLang];

        const msg = (msgSet as any)[errorKey] || 'Invalid field';

        return msg
            .replace('{field}', field)
            .replace('{value}', value);
    }

    getBackendMessage(code: string): string {
        return messages[this.currentLang].backend[code] || 'Server error';
    }
}
