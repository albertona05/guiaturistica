import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import * as CryptoJS from 'crypto-js';  
import { jwtDecode } from 'jwt-decode'; 
import { CookieService } from 'ngx-cookie-service';
import { UserModel } from '../interfaces/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/users';

  // BehaviorSubject para notificar cambios en la sesión
  private sessionState = new BehaviorSubject<boolean>(false);
  sessionState$ = this.sessionState.asObservable();

  constructor(private http: HttpClient, private _cookieService: CookieService) {}

  // Maneja el inicio de sesión de un usuario
  loginUser(email: string, password: string): Observable<{ role: string, email: string, token: string, id: string }> {
    return new Observable(observer => {
      this.http.get<UserModel[]>(this.apiUrl).subscribe(users => {
        const validUser = users.find(user => user.email === email);
  
        if (!validUser) {
          console.warn("Usuario no encontrado:", email);
          observer.error('Credenciales incorrectas');
          return;
        }
  
        const hashedInputPassword = CryptoJS.SHA256(password).toString();
        console.log("Contraseña ingresada en SHA256:", hashedInputPassword);
        console.log("Contraseña almacenada en dbCadiz.json:", validUser.password);
  
        if (hashedInputPassword === validUser.password) {
          // Se crea un JWT manualmente (sin firma)
          const header = { alg: "HS256", typ: "JWT" };
          const payload = { id: validUser.id, email: validUser.email, role: validUser.role };

          const base64Header = btoa(JSON.stringify(header));
          const base64Payload = btoa(JSON.stringify(payload));

          const token = `${base64Header}.${base64Payload}.firma_mock`;

          console.log("Token generado correctamente:", token);

          // Guardamos el token en cookies con configuración segura
          this._cookieService.set('token', token, { path: '/', expires: 1, secure: true, sameSite: 'None' });

          console.log("Token guardado en cookie:", this._cookieService.get('token'));

          // Notificar a la navbar que la sesión ha iniciado
          this.sessionState.next(true);

          observer.next({ role: validUser.role, email: validUser.email, token, id: validUser.id });
          observer.complete();
        } else {
          console.warn("Las contraseñas no coinciden.");
          observer.error('Credenciales incorrectas');
        }
      });
    });
  }

  // Verifica si hay un usuario logueado
  isLoggedIn(): boolean {
    return this._cookieService.get('token') !== '';
  }

  // Verifica si un correo ya está registrado
  comprobarCorreo(email: string): Observable<UserModel[]> {
    return this.http.get<UserModel[]>(`${this.apiUrl}?email=${email}`);
  }

  // Agrega un nuevo usuario
  addUser(user: UserModel): Observable<UserModel> {
    return this.http.post<UserModel>(this.apiUrl, user);
  }

  // Obtiene el rol del usuario logueado
  getUserRole(): string | null {
    const token = this._cookieService.get('token');
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token); 
      return payload.role;
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

  // Obtiene el ID del usuario logueado desde el token
  getUserId(): string | null {
    const token = this._cookieService.get('token');
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      return payload.id;
    } catch (error) {
      console.error('Error al obtener el ID del usuario:', error);
      return null;
    }
  }

  // Cierra la sesión del usuario
  logout() {
    console.log("Cierre de sesión iniciado");

    this._cookieService.delete('token', '/');
    this._cookieService.delete('userRole', '/');
    this._cookieService.delete('userEmail', '/');
    

    console.log("Cookies eliminadas");

    // Notificar a la navbar que la sesión ha finalizado
    this.sessionState.next(false);
  }
}


