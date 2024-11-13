import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, RouterModule, withPreloading } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // wrapps asynchronous operations in a zone helps Angular automatically detect changes and update the view accordingly
    // { eventCoalescing: true } groups together events to trigger change detection only once instead of multiple times
    provideZoneChangeDetection({ eventCoalescing: true }),

    // configures the router to set up navigation according to the specified routes
    // and to preload all lazy-loaded modules for better performance
    provideRouter(routes, withPreloading(PreloadAllModules)),

    provideClientHydration(),
    provideAnimationsAsync(),
    provideHttpClient(withFetch() /** withInterceptors([authInterceptor]) */),
    importProvidersFrom(RouterModule)
  ]
};
