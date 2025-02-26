import { Component, Inject, OnInit } from '@angular/core';
import { SitiosServiceService } from '../service/sitios-service.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlaceModel } from '../interfaces/place.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-add-edit-place',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './add-edit-place.component.html',
  styleUrls: ['./add-edit-place.component.css']
})
export class AddEditPlaceComponent implements OnInit {
  formPlace: FormGroup;
  isEditing: boolean = false;
  isSubmitting: boolean = false; 

  constructor(
    private _fb: FormBuilder,
    private placeService: SitiosServiceService,
    private _dialogRef: MatDialogRef<AddEditPlaceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlaceModel | null
  ) {
    this.isEditing = !!(data && data.id);

    this.formPlace = this._fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      parrafo1: ['', [Validators.required, Validators.minLength(10)]],
      parrafo2: ['', [Validators.required, Validators.minLength(10)]],
      imageUrl: ['', [Validators.required]],  
      imageGallery: [[]],  
      rating: [[]],
      comments: [[]],
      commentUser: [[]]
    });

    this.formPlace.updateValueAndValidity();
  }

  ngOnInit(): void {
    if (this.isEditing && this.data) {
      this.formPlace.patchValue({
        name: this.data.name,
        description: this.data.description,
        parrafo1: this.data.parrafo1,
        parrafo2: this.data.parrafo2,
        imageUrl: this.data.imageUrl || '',
        imageGallery: this.data.imageGallery ? [...this.data.imageGallery] : []
      });
    }
  }

  
  // Maneja la selección de archivos e inserta la URL en el formulario.
  onFileSelected(event: any, isMainImage: boolean) {
    const file: File = event.target.files[0];

    if (!file) {
      console.warn("No se seleccionó ningún archivo.");
      return;
    }

    const fileName = file.name;
    const imagePath = `../assets/imgs/${fileName}`;

    console.log("Imagen seleccionada:", fileName);
    console.log("Ruta guardada:", imagePath);

    if (isMainImage) {
      this.formPlace.patchValue({ imageUrl: imagePath });
    } else {
      let gallery = [...(this.formPlace.value.imageGallery || [])];
      gallery.push(imagePath);
      this.formPlace.patchValue({ imageGallery: gallery });
    }

    this.formPlace.updateValueAndValidity();
  }

  
  // Elimina la imagen principal o de la galería.
  removeImage(isMainImage: boolean, index?: number) {
    if (isMainImage) {
      this.formPlace.patchValue({ imageUrl: '' });
    } else if (index !== undefined) {
      let gallery = [...(this.formPlace.value.imageGallery || [])];
      if (index >= 0 && index < gallery.length) {
        gallery.splice(index, 1);
        this.formPlace.patchValue({ imageGallery: gallery });
      }
    }
  }


  // Guarda o edita un sitio, evitando duplicaciones.
  savePlace() {
    if (this.formPlace.invalid || this.isSubmitting) {
      console.warn("Formulario inválido o ya en proceso.");
      return;
    }

    this.isSubmitting = true; 

    const placeData: Partial<PlaceModel> = this.formPlace.getRawValue(); 

    console.log("Guardando sitio:", placeData);

    if (this.isEditing && this.data?.id) {
      this.editarSitio(this.data.id, placeData);
    } else {
      this.crearSitio(placeData);
    }
  }

  
  // Editar sitio existente.
  private editarSitio(id: string, placeData: Partial<PlaceModel>) {
    console.log("Editando sitio con ID:", id);
    this.placeService.editPlace(id, placeData as PlaceModel).subscribe({
      next: () => {
        console.log("Sitio editado con éxito");
        this.closeDialog();
      },
      error: (err) => {
        console.error("Error al editar el sitio:", err);
        this.isSubmitting = false; 
      }
    });
  }

  
  // Crear nuevo sitio.
  private crearSitio(placeData: Partial<PlaceModel>) {
    console.log("Creando nuevo sitio...");
    this.placeService.addPlace(placeData as PlaceModel).subscribe({
      next: (createdSite) => {
        console.log("Nuevo sitio creado con éxito", createdSite);
        this.closeDialog();
      },
      error: (err) => {
        console.error("Error al agregar sitio:", err);
        this.isSubmitting = false;
      }
    });
  }

  /**
   * Cierra el modal y restablece `isSubmitting`.
   */
  closeDialog(): void {
    this.isSubmitting = false;
    this._dialogRef.close(true);
  }
}




