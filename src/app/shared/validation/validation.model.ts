export interface ValidationMessageSet {
    required: string;
    email: string;
    minlength: string;
    backend: {
        [key: string]: string;
    };
}

export interface ValidationMessages {
    en: ValidationMessageSet;
    hi: ValidationMessageSet;
}
