import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaceModel } from '../interfaces/place.model';

@Injectable({
  providedIn: 'root'
})
export class SitiosServiceService {
  private urlBBDD = 'http://localhost:3000/sitios'; // JSON-Server

  constructor(private _http: HttpClient) {}

  /**
   * Obtiene todos los sitios disponibles.
   */
  getSites(): Observable<PlaceModel[]> {
    return this._http.get<PlaceModel[]>(this.urlBBDD);
  }

  /**
   * Obtiene un sitio por su ID.
   */
  getSiteById(id: string): Observable<PlaceModel> {
    return this._http.get<PlaceModel>(`${this.urlBBDD}/${id}`);
  }

  /**
   * Obtiene los sitios para la administración.
   */
  getPlacesAdmin(): Observable<PlaceModel[]> {
    return this._http.get<PlaceModel[]>(this.urlBBDD);
  }

 

  /**
   * Agrega un nuevo sitio.
   */
  addPlace(data: PlaceModel): Observable<PlaceModel> {
    console.log("Creando nuevo sitio:", data);
    return this._http.post<PlaceModel>(this.urlBBDD, data); // json-server generará el ID
  }
  

   /**
   * Edita un sitio existente.
   */
   editPlace(id: string, data: PlaceModel): Observable<PlaceModel> {
    console.log("Editando sitio con ID:", id);
    return this._http.put<PlaceModel>(`${this.urlBBDD}/${id}`, data);
  }

  /**
   * Elimina un sitio por su ID.
   */
  deletePlace(id: string): Observable<void> {
    console.log("Eliminando sitio con ID:", id);
    return this._http.delete<void>(`${this.urlBBDD}/${id}`);
  }
}

