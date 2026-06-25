import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
    name: 'textTransform',
    standalone: true
})
export class TextTransformPipe implements PipeTransform {
    transform(value: string, type: string): string {
        if (!value) return '';

        switch (type) {
            case 'uppercase':
                return value.toUpperCase();
            case 'lowercase':
                return value.toLowerCase();
            default:
                return value;
        }
    }
}



