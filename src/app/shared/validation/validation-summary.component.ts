import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
    selector: 'app-validation-summary',
    standalone: true,
    imports: [CommonModule],
    template: `
   @if(form?.invalid && submitted) {

    <div class="p-2 bg-red-50 text-red-600">

        @for(error of getErrors(); track error) {

            <p>• {{ error }}</p>

        }

    </div>

}
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
