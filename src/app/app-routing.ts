import { Routes } from '@angular/router';
import { UserGuard } from './utils/user-guard.guard'; // Se importa correctamente UserGuard

export const appRoutes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', loadComponent: () => import('./contentcard/contentcard.component').then(m => m.ContentcardComponent) },
  { path: 'sitio/:id', loadComponent: () => import('./content/content.component').then(m => m.ContentComponent) }, 
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./reg-form/reg-form.component').then(m => m.RegFormComponent) }, // Registro de usuario
  { path: 'registrar', loadComponent: () => import('./reg-form/reg-form.component').then(m => m.RegFormComponent) }, // Alternativa de registro
  // Protegemos adminplaces con UserGuard
  { path: 'adminplaces', loadComponent: () => import('./admin-places/admin-places.component').then(m => m.AdminPlacesComponent), canActivate: [UserGuard] },

  { path: 'edit/:id', loadComponent: () => import('./add-edit-place/add-edit-place.component').then(m => m.AddEditPlaceComponent) }, // Editar un sitio específico
  { path: 'edit', loadComponent: () => import('./add-edit-place/add-edit-place.component').then(m => m.AddEditPlaceComponent) }, // Editar sin ID específico

  { path: '**', redirectTo: 'inicio' } // Redirige a inicio si la ruta no existe
];


