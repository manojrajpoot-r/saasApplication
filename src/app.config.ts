
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { MessageService } from 'primeng/api';
import {authInterceptor} from 'src/app/core/interceptors/authInterceptor';
import { appRoutes } from './app.routes';

import {
    provideHttpClient,
    withFetch,
    withInterceptors
} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(
            appRoutes,
            withInMemoryScrolling({
                anchorScrolling: 'enabled',
                scrollPositionRestoration: 'enabled'
            }),
            withEnabledBlockingInitialNavigation()
        ),

        provideHttpClient(
            withFetch(),
            withInterceptors([
                authInterceptor
            ])
        ),

        provideZonelessChangeDetection(),

        providePrimeNG({
            theme: {
                preset: Aura,
                options: {
                    darkModeSelector: '.app-dark'
                }
            }
        }),

        MessageService
    ]
};