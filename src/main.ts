import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app/app-routing';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; 

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),  // Se añade el sistema de rutas
    provideHttpClient(),
    provideAnimations(),
    importProvidersFrom(CookieService), provideAnimationsAsync()
  ]
}).catch(err => console.error(err));
