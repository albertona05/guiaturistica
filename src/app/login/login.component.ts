import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../service/login.service';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form: FormGroup;
  hidePassword = true; 

  constructor(
    private _fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _loginService: LoginService,
    private _cookieService: CookieService
  ) {
    this.form = this._fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  login() {
    const { email, password } = this.form.value;

    console.log("Intentando iniciar sesión con:", email);

    this._loginService.loginUser(email, password).subscribe({
      next: (result: { role: string, email: string, token: string } | {}) => {
        if ('role' in result && 'token' in result) {
          this._cookieService.set('token', result.token);
          this._cookieService.set('userEmail', result.email);
          this._cookieService.set('userRole', result.role);

          const redirectRoute = result.role === 'administrador' ? '/adminplaces' : '/inicio';
          this._router.navigate([redirectRoute]);
        } else {
          this.mostrarError('Los datos introducidos son incorrectos o no existen');
        }
      },
      error: () => {
        this.mostrarError('Error en el inicio de sesión. Intente nuevamente.');
      },
    });
  }

  mostrarError(mensaje: string) {
    this._snackBar.open(mensaje, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
    this.form.reset();
  }
}
