import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-validation-summary',
    template: `
    <div *ngIf="form?.invalid && submitted" class="p-2 bg-red-50 text-red-600">

      <p *ngFor="let error of getErrors()">
        • {{ error }}
      </p>

    </div>
  `
})
export class ValidationSummaryComponent {

    @Input() form!: FormGroup;
    @Input() submitted = false;

    getErrors(): string[] {

        const errors: string[] = [];

        Object.keys(this.form.controls).forEach(key => {

            const control = this.form.get(key);

            if (control?.errors) {
                errors.push(`${key} is invalid`);
            }
        });

        return errors;
    }
}
