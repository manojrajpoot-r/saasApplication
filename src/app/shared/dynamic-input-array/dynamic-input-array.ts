import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
@Component({
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputTextModule,
        TableModule,
        ButtonModule
    ],
    selector: 'app-dynamic-input-array',
    templateUrl: './dynamic-input-array.html'
})
export class DynamicInputArrayComponent {

    @Input() label = '';
    @Input() formArray!: FormArray;


    getControl(i: number): FormControl {
        return this.formArray.at(i) as FormControl;
    }
    addField() {
        this.formArray.push(
            new FormControl('', Validators.required)
        );
    }

    removeField(index: number) {
        if (this.formArray.length > 1) {
            this.formArray.removeAt(index);
        }
    }
}
