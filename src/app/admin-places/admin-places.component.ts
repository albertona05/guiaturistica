import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { SitiosServiceService } from '../service/sitios-service.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirmdialog/confirmdialog.component';
import { Router } from '@angular/router';
import { AddEditPlaceComponent } from '../add-edit-place/add-edit-place.component';
import { CookieService } from 'ngx-cookie-service';
import { PlaceModel } from '../interfaces/place.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin-places',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatCardModule 
  ],
  templateUrl: './admin-places.component.html',
  styleUrls: ['./admin-places.component.css']
})
export class AdminPlacesComponent implements OnInit {

  displayedColumns: string[] = ['id', 'nombre', 'actions'];
  dataSource = new MatTableDataSource<PlaceModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _placesService: SitiosServiceService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    private _cookieService: CookieService,
    private _router: Router) {}

  ngOnInit(): void {
    this.checkUserRole();
    this.showPlaces();
  }

  /**
   * Verifica si el usuario tiene rol de administrador.
   */
  checkUserRole() {
    const token = this._cookieService.get("token");
    if (!token) {
      console.warn("No hay token, redirigiendo a inicio.");
      this._router.navigate(["/inicio"]);
      return;
    }

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      const role = tokenPayload.role;
      console.log("Rol obtenido:", role);

      if (role !== "administrador") {
        console.warn("No es administrador, redirigiendo a inicio.");
        this._router.navigate(["/inicio"]);
      }
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      this._router.navigate(["/inicio"]);
    }
  }

  /**
   * Obtiene la lista de lugares y la asigna a la tabla.
   */
  showPlaces() {
    this._placesService.getPlacesAdmin().subscribe({
      next: (res) => {
        this.dataSource.data = res;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error("Error al obtener lugares:", err)
    });
  }

  /**
   * Aplica un filtro en la tabla.
   */
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Elimina un sitio con confirmación.
   */
  eliminarSitio(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '600px',
      data: { mensaje: '¿Estás seguro de que deseas eliminar este sitio?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._placesService.deletePlace(id).subscribe({
          next: () => {
            this.showPlaces();
            this._snackBar.open('Sitio eliminado con éxito', 'Cerrar', { duration: 1500 });
          },
          error: (err) => console.error("Error al eliminar el sitio:", err)
        });
      } else {
        this._snackBar.open('Sitio no eliminado', 'Cerrar', { duration: 1500 });
      }
    });
  }

  /**
   * Abre el diálogo para editar un sitio.
   */
  editPlace(data: PlaceModel) {
    const dialogRef = this.dialog.open(AddEditPlaceComponent, {
      width: '750px',
      height: '800px',
      data: { ...data, isEditing: true }
    });

    dialogRef.afterClosed().subscribe(val => {
      if (val) this.showPlaces();
    });
  }

  /**
   * Abre el diálogo para crear un nuevo sitio.
   */
  createPlace() {
    const dialogRef = this.dialog.open(AddEditPlaceComponent, {
      width: '750px',
      height: '800px',
      data: null 
    });
    

    dialogRef.afterClosed().subscribe(val => {
      if (val) this.showPlaces();
    });
  }

}

