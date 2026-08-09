import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { CarouselSlide } from '../models/carousel.model';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/carousel';

  public async getSlides(): Promise<CarouselSlide[]> {
    try {
      return await firstValueFrom(this.http.get<CarouselSlide[]>(this.apiUrl));
    } catch (err) {
      console.error('Error al obtener portadas:', err);
      return [];
    }
  }

  public async getSlide(id: number): Promise<CarouselSlide | undefined> {
    try {
      return await firstValueFrom(this.http.get<CarouselSlide>(`${this.apiUrl}/${id}`));
    } catch (err) {
      console.error('Error al obtener portada:', err);
      return undefined;
    }
  }

  public async createSlide(slide: Omit<CarouselSlide, 'id'>): Promise<CarouselSlide | undefined> {
    try {
      return await firstValueFrom(this.http.post<CarouselSlide>(this.apiUrl, slide));
    } catch (err) {
      console.error('Error al crear portada:', err);
      return undefined;
    }
  }

  public async updateSlide(id: number, slide: Partial<CarouselSlide>): Promise<CarouselSlide | undefined> {
    try {
      return await firstValueFrom(this.http.patch<CarouselSlide>(`${this.apiUrl}/${id}`, slide));
    } catch (err) {
      console.error('Error al actualizar portada:', err);
      return undefined;
    }
  }

  public async deleteSlide(id: number): Promise<boolean> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      return true;
    } catch (err) {
      console.error('Error al eliminar portada:', err);
      return false;
    }
  }
}
