import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CookieService } from 'ngx-cookie-service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { LoginService } from '../service/login.service';
import { MatDialog } from '@angular/material/dialog';
import { RegFormComponent } from '../reg-form/reg-form.component';
import { MatIconModule } from '@angular/material/icon'; 
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSnackBarModule, MatToolbarModule, MatIconModule, MatMenuModule  ], 
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  firstname: string = "";
  isAdmin: boolean = false;
  isUser: boolean = false;
  private sessionSubscription!: Subscription;

  constructor(
    private _cookieService: CookieService, 
    private _router: Router, 
    private _sharedService: MatSnackBar,
    private _loginService: LoginService
  ) {}

  ngOnInit() {
    console.log("Ejecutando ngOnInit en Navbar");
    this.getUserInfo();

    this.sessionSubscription = this._loginService.sessionState$.subscribe((isLoggedIn) => {
      console.log("Cambio detectado en la sesión:", isLoggedIn);
      this.getUserInfo();
    });
  }

  ngOnDestroy() {
    if (this.sessionSubscription) {
      this.sessionSubscription.unsubscribe(); 
    }
  }

  /**
   * Obtiene la información del usuario desde el token almacenado en cookies.
   */
  getUserInfo(): void {
    console.log("Ejecutando getUserInfo en Navbar");

    let tokenMatch = document.cookie.split('; ').find(row => row.startsWith('token='));
    let token = tokenMatch ? decodeURIComponent(tokenMatch.split('=')[1]) : null;

    console.log("Token recuperado en navbar:", token ? token : "No encontrado");

    if (!token || token === '') {
      console.warn("No hay token en las cookies, sesión cerrada");
      this.isAdmin = false;
      this.isUser = false;
      this.firstname = "";
      return;
    }

    try {
      const tokenPayload: any = JSON.parse(atob(token.split('.')[1]));
      console.log("Token decodificado en Navbar:", tokenPayload);

      this.firstname = tokenPayload.email.split('@')[0];
      this.isAdmin = tokenPayload.role === "administrador";
      this.isUser = tokenPayload.role === "usuario";

      console.log("isAdmin:", this.isAdmin, "isUser:", this.isUser);
    } catch (error) {
      console.error("Error al decodificar el token en Navbar:", error);
      this.logout();
    }
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    console.log("Cierre de sesión iniciado");
    this._loginService.logout(); 
    this._router.navigate(['/inicio']).then(() => {
      location.reload(); 
    });
  }
}

