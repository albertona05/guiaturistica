import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export const JwtInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const token = cookieService.get('token'); // usamos cookies en lugar de localStorage

  if (token) {
    console.log("Añadiendo token al encabezado:", token);
    const clonedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(clonedReq);
  } else {
    console.warn("No hay token disponible, enviando solicitud sin autenticación.");
    return next(req);
  }
};

