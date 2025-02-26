import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { JwtInterceptor } from './utils/jwt-interceptor.interceptor';  // Asegúrate de que este archivo exista

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]), // Agrega las rutas aquí
    provideHttpClient(withInterceptors([JwtInterceptor])) // Agregar Interceptor
  ]
};
