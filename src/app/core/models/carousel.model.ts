export interface CarouselSlide {
  id: number;
  image: string; // Base64 or URL representation
  badge: string;
  title: string;
  description: string;
  link: string;
  alineacion?: 'izquierda' | 'centro' | 'derecho';
}
