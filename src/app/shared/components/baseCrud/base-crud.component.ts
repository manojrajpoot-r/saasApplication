import { Directive } from '@angular/core';

@Directive()
export abstract class BaseCrudComponent<T> {

    data: T[] = [];

    loading = false;

    selectedId: number | null = null;

    isSubmitting = false;

    abstract load(): void;

    reset(): void {
        this.selectedId = null;
    }
}