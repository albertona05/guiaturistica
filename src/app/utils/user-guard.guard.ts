import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {
  constructor(private _cookieService: CookieService, private _router: Router) {}

  canActivate(): boolean {
    console.log("UserGuard ejecutado");

    const token = this._cookieService.get('token');

    if (!token) {
      console.warn('No hay token, redirigiendo a login.');
      this._router.navigate(['/login']);
      return false;
    }

    try {
      console.log("Intentando decodificar token:", token);

      // Verificar que el token tenga la estructura correcta
      const partesToken = token.split('.');
      if (partesToken.length !== 3) {
        console.error("Token con estructura incorrecta:", token);
        this._router.navigate(['/login']);
        return false;
      }

      const payloadBase64 = partesToken[1];
      console.log("Base64 del Payload:", payloadBase64);

      if (!payloadBase64) {
        console.error("No se pudo extraer el payload del token.");
        this._router.navigate(['/login']);
        return false;
      }

      const decodedPayload = atob(payloadBase64);
      console.log("Payload en Base64 decodificado:", decodedPayload);

      const tokenPayload: any = JSON.parse(decodedPayload);
      console.log("Token decodificado en UserGuard:", tokenPayload);

      if (!tokenPayload.role) {
        console.error("No se encontró el campo 'role' en el token.");
        this._router.navigate(['/login']);
        return false;
      }

      const role = tokenPayload.role;
      console.log(`Rol obtenido del token: ${role}`);

      if (role === 'administrador') {
        console.log("Acceso permitido para administrador");
        return true;
      } else {
        console.warn(`Acceso denegado para rol: ${role}, redirigiendo a inicio.`);
        this._router.navigate(['/inicio']);
        return false;
      }
    } catch (error) {
      console.error("Error al decodificar el token en UserGuard:", error);
      this._router.navigate(['/login']);
      return false;
    }

    return false; // Se agrega un return false al final para evitar el error
  }
}








