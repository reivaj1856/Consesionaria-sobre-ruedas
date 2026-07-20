import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly apiUrl = 'http://localhost:3000/api/favorites';
  private readonly storageKey = 'concesionaria_favorites';
  
  private readonly favoritesSignal = signal<string[]>([]);
  public readonly favorites = this.favoritesSignal.asReadonly();
  
  public readonly favoritesCount = computed(() => this.favorites().length);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadFavoritesFromApi();
      } else {
        this.loadFavoritesFromLocalStorage();
      }
    });
  }

  private loadFavoritesFromLocalStorage(): void {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        try {
          this.favoritesSignal.set(JSON.parse(stored));
        } catch (e) {
          console.error('Error al cargar favoritos locales', e);
        }
      } else {
        this.favoritesSignal.set([]);
      }
    }
  }

  private async loadFavoritesFromApi(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<string[]>(this.apiUrl));
      this.favoritesSignal.set(data);
    } catch (err) {
      console.error('Error al cargar favoritos desde API:', err);
      this.loadFavoritesFromLocalStorage();
    }
  }

  private async saveFavoritesLocal(ids: string[]): Promise<void> {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.storageKey, JSON.stringify(ids));
    }
    this.favoritesSignal.set(ids);
  }

  public isFavorite(vehicleId: string): boolean {
    return this.favorites().includes(vehicleId);
  }

  public async toggleFavorite(vehicleId: string): Promise<void> {
    const user = this.authService.currentUser();
    
    if (!user) {
      const current = this.favorites();
      const updated = current.includes(vehicleId)
        ? current.filter(id => id !== vehicleId)
        : [...current, vehicleId];
      await this.saveFavoritesLocal(updated);
      return;
    }

    try {
      const response = await firstValueFrom(
        this.http.post<{ favorited: boolean }>(`${this.apiUrl}/${vehicleId}`, {})
      );
      
      const current = this.favorites();
      const updated = response.favorited
        ? [...current, vehicleId]
        : current.filter(id => id !== vehicleId);
        
      this.favoritesSignal.set(updated);
    } catch (err) {
      console.error('Error al alternar favorito en API:', err);
    }
  }

  public async removeFavorite(vehicleId: string): Promise<void> {
    const user = this.authService.currentUser();
    if (!user) {
      const current = this.favorites();
      if (current.includes(vehicleId)) {
        await this.saveFavoritesLocal(current.filter(id => id !== vehicleId));
      }
      return;
    }

    try {
      const current = this.favorites();
      if (current.includes(vehicleId)) {
        await this.toggleFavorite(vehicleId);
      }
    } catch (err) {
      console.error('Error al remover favorito:', err);
    }
  }
}
