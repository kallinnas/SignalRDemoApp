import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, RouterModule, withPreloading } from '@angular/router';
import { ToastrModule } from 'ngx-toastr';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideClientHydration(),
    provideAnimationsAsync(),
  //   provideHttpClient(withFetch()
  //   // , withInterceptors([authInterceptor])
  // ),
    importProvidersFrom(ToastrModule.forRoot({ enableHtml: true, timeOut: 10000, positionClass: 'toast-top-right', preventDuplicates: false })),
    importProvidersFrom(RouterModule)
  ]
};
