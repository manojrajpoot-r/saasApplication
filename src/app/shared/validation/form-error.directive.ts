import {
    Directive, Input, OnInit,
    ElementRef, Renderer2
} from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { ValidationService } from './validation.service';

@Directive({
    selector: '[appFieldError]'
})
export class FormErrorDirective implements OnInit {

    @Input('appFieldError') control!: AbstractControl | null;
    @Input() fieldName = '';

    private errorEl!: HTMLElement;

    constructor(
        private el: ElementRef,
        private renderer: Renderer2,
        private validation: ValidationService
    ) { }

    ngOnInit(): void {

        this.errorEl = this.renderer.createElement('small');
        this.renderer.addClass(this.errorEl, 'text-red-500');

        this.renderer.appendChild(
            this.el.nativeElement.parentNode,
            this.errorEl
        );

        this.control?.statusChanges.subscribe(() => this.update());
        this.control?.valueChanges.subscribe(() => this.update());

        this.update();
    }

    update(): void {

        const c = this.control;

        if (!c || !c.invalid || !(c.touched || c.dirty)) {
            this.errorEl.innerText = '';
            return;
        }

        const errors = c.errors;

        if (errors?.['required']) {
            this.errorEl.innerText =
                this.validation.getMessage('required', this.fieldName);
        }

        if (errors?.['email']) {
            this.errorEl.innerText =
                this.validation.getMessage('email', this.fieldName);
        }

        if (errors?.['minlength']) {
            this.errorEl.innerText =
                this.validation.getMessage(
                    'minlength',
                    this.fieldName,
                    errors['minlength'].requiredLength
                );
        }

        // Backend error support
        if (errors?.['backend']) {
            this.errorEl.innerText =
                this.validation.getBackendMessage(errors['backend']);
        }
    }
}
