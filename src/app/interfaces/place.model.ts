export interface PlaceModel {
  id?: string;
  name: string;
  description: string;
  parrafo1: string;
  parrafo2: string;
  imageUrl: string; // Imagen principal
  imageGallery?: string[]; // galería de imágenes
  rating?: string[];
  comments?: string[];
  commentUser?: string[];
}

