import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SitiosServiceService } from '../service/sitios-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatGridListModule,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDialogModule,
    MatInputModule
  ],
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.css'],
})

export class ContentComponent implements OnInit {
  place: any = null;
  isLoading: boolean = true;
  formCommentRating: FormGroup;

  possibleRating = ['0', '1', '2', '3', '4', '5'];

  loggedIn: boolean = false;
  loggedUserId: string = '';
  

  constructor(
    private route: ActivatedRoute,
    private placeService: SitiosServiceService,
    private _fb: FormBuilder,
    private _cookieService: CookieService
  ) {
    this.formCommentRating = this._fb.group({
      rating: ['', [Validators.required]],
      comment: ['', [Validators.required]],
    });
  }

  imagenCentral: string = '';

ngOnInit(): void {
    this.route.params.subscribe((params) => {
        const placeId = params['id'];
        if (placeId) {
            this.placeService.getSiteById(placeId).subscribe({
                next: (place) => {
                    this.place = place;
                    this.imagenCentral = place.imageUrl;
                    this.isLoading = false;
                },
                error: (err) => {
                    console.error("Error al obtener el sitio:", err);
                    this.place = null;
                    this.isLoading = false;
                }
            });
        }
    });
}

/**
 * Método para cambiar la imagen central al hacer clic en una imagen pequeña.
 */
cambiarImgCentral(nuevaImagen: string) {
    this.imagenCentral = nuevaImagen;
}

  /**
   * Verifica si el usuario está logueado y obtiene su ID.
   */
  checkLoginStatus() {
    let token = this._cookieService.get('token');

    if (!token) {
      console.warn("No hay token, usuario no logueado.");
      this.loggedIn = false;
      return;
    }

    try {
      let tokenPayLoad = JSON.parse(atob(token.split('.')[1]));
      console.log("Token guardado en cookie:", this._cookieService.get('token'));

  
      this.loggedUserId = tokenPayLoad.id || "";
      this.loggedIn = tokenPayLoad.role !== 'administrador';
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      this.loggedIn = false;
    }

    console.log("Estado de sesión: loggedIn =", this.loggedIn, "loggedUserId =", this.loggedUserId);
    
  }

  /**
   * Cambia la imagen central al hacer clic en otra imagen de la galería.
   */
  cambiarImgCental(urlPoner: any, idImgCambiar: any) {
    let imgCentral = document.getElementById('imgCentral') as HTMLImageElement;
    let imgCambiar = document.getElementById(idImgCambiar) as HTMLImageElement;

    if (!imgCentral || !imgCambiar) {
      console.warn("No se encontraron los elementos de imagen.");
      return;
    }

    let urlImgCental = imgCentral.src;
    let urlImgCambiar = imgCambiar.src;

    imgCentral.src = urlImgCambiar;
    imgCambiar.src = urlImgCental;
  }

  /**
   * Calcula la media de valoraciones.
   */
  calcularMedia(ratings: string[]): string {
    if (!ratings || ratings.length === 0) {
      return "0.0";
    }

    let valoracionesNumericas = ratings.map(rating => parseFloat(rating));
    let suma = valoracionesNumericas.reduce((total, rating) => total + rating, 0);

    return (suma / valoracionesNumericas.length).toFixed(2).toString();
  }

  /**
   * Envía el formulario de valoración y comentario.
   */
  submitformCommentRating() {
    if (this.formCommentRating.valid) {
      if (!this.place) {
        console.warn("No se ha cargado un sitio válido.");
        return;
      }

      this.place.rating.push(this.formCommentRating.value.rating);
      this.place.comments.push(this.formCommentRating.value.comment);
      this.place.commentUser.push(this.loggedUserId);

      this.placeService.editPlace(this.place.id, this.place).subscribe({
        next: (val) => {
          console.log("Comentario guardado:", val);
        },
        error: (err) => {
          console.error("Error al guardar el comentario:", err);
        }
      });
    }
  }
}
