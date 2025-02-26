import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SitiosServiceService } from '../service/sitios-service.service';
import { PdfMakeWrapper, Txt, Img } from 'pdfmake-wrapper';
import * as pdfFonts from "pdfmake/build/vfs_fonts";  

PdfMakeWrapper.setFonts(pdfFonts as any);

@Component({
  selector: 'app-contentcard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,  
    MatGridListModule,  
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './contentcard.component.html',
  styleUrls: ['./contentcard.component.css']
})
export class ContentcardComponent implements OnInit {
  places: any[] = [];
  gridCols: number = 3;
  bestRatedPlaces: any[] = []; 
  randomComments: any[] = [];

  constructor(private placesService: SitiosServiceService) { }

  ngOnInit(): void {
    this.placesService.getSites().subscribe(places => {
      console.log(places);
      this.places = places;

      // Filtrar los lugares con mejor rating
      this.bestRatedPlaces = this.places.filter(place => place.rating.length > 0)
                                         .sort((a, b) => this.calcularMedia(b.rating) - this.calcularMedia(a.rating))
                                         .slice(0, 3); 

      // Obtener 3 comentarios aleatorios con más detalles
      this.randomComments = this.getRandomComments(this.places);
    });

    // Inicializa las columnas según el tamaño de la ventana al cargar
    this.updateGridCols(window.innerWidth);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateGridCols(event.target.innerWidth);
  }

  // Función para actualizar el número de columnas basado en el ancho de la ventana
  updateGridCols(width: number) {
    if (width < 600) {
      this.gridCols = 1; 
    } else if (width < 960) {
      this.gridCols = 2; 
    } else {
      this.gridCols = 3;
    }
  }

  // Función para calcular la media de las valoraciones
  calcularMedia(ratings: string[]): number {
    let valoracionesNumericas = ratings.map(rating => parseFloat(rating));
    let suma = valoracionesNumericas.reduce((total, rating) => total + rating, 0);
    return (suma / valoracionesNumericas.length);
  }

  // Función para obtener la descripción de un lugar y recortarla si es necesario
  descripcionMostrar(descripcion: string): string {
    const palabras = descripcion.split(' ');
    if (palabras.length <= 50) {
      return descripcion;
    }
    const primera50Palabras = palabras.slice(0, 50).join(' ');
    return `${primera50Palabras}...`;
  }

  // Función para obtener 3 comentarios aleatorios de los lugares con más detalles (imagen y rating)
  getRandomComments(places: any[]): any[] {
    const comments: any[] = places.flatMap(place => 
      (place.comments || []).map((comment: string, index: number) => ({
        monumentName: place.name,
        imageUrl: place.imageUrl,
        text: comment,
        rating: place.rating[index] || 'NV' 
      }))
    );

    // Eliminar comentarios duplicados
    const seen = new Set();
    const uniqueComments = comments.filter(comment => {
      const key = comment.text + comment.monumentName;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });

    // Tomamos 3 comentarios aleatorios sin duplicados
    const randomComments = [];
    for (let i = 0; i < 3 && uniqueComments.length > 0; i++) {
      const randomIndex = Math.floor(Math.random() * uniqueComments.length);
      randomComments.push(uniqueComments[randomIndex]);
      uniqueComments.splice(randomIndex, 1);
    }

    return randomComments;
  }

  // Función para descargar el PDF
  async descargarPDF() {
    const pdf = new PdfMakeWrapper();

    for (const sitio of this.places) {
      pdf.add(new Txt(`Nombre: ${sitio.name}`).style('subtitulo').end);
      pdf.add(new Txt(sitio.descripcion).style('normal').end);
      pdf.add(new Txt(sitio.parrafo1).style('normal').end);
      pdf.add(new Txt(sitio.parrafo2).style('normal').end);

      // Sólo la imagen principal
      const imageUrls = [ sitio.imageUrl ];

      for (let i = 0; i < imageUrls.length; i++) {
        if (imageUrls[i]) {
          try {
            pdf.add(await new Img(imageUrls[i]).width(180).height(130).margin([0, 20, 0, 0]).build());
          } catch (error) {
            console.error(`Error al cargar la imagen ${imageUrls[i]}`, error);
          }
        }
      }

      if (this.places.indexOf(sitio) !== this.places.length - 1) {
        pdf.add({ text: '', pageBreak: 'after' });
      }
    }

    pdf.styles({
      titulo: { fontSize: 18, bold: true, margin: [0, 10, 0, 0] },
      subtitulo: { fontSize: 16, bold: true, margin: [0, 10, 0, 0] },
      normal: { fontSize: 12, margin: [0, 5, 0, 0] },
    });

    pdf.create().download('Sevilla_Listado.pdf');
  }
}
