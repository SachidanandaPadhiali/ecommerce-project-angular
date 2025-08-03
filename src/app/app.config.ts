import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, RouteReuseStrategy } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { NoReuseStrategy } from './route-reuse.strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(), provideHttpClient(withFetch()),
    provideZonelessChangeDetection(), provideHttpClient(),
    provideRouter(routes), provideClientHydration(withEventReplay()),
    { provide: RouteReuseStrategy, useClass: NoReuseStrategy }
  ]
};
