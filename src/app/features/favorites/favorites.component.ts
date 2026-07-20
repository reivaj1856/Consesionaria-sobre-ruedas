import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { VehicleService } from '../../core/services/vehicle.service';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink, VehicleCardComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="border-b border-slate-200 pb-5">
        <h1 class="font-heading text-3xl font-extrabold text-slate-900">Mis Vehículos Favoritos</h1>
        <p class="mt-2 text-sm text-slate-500">Administra los autos, motos y maquinarias que has guardado</p>
      </div>

      @if (favoriteVehicles().length > 0) {
        <!-- Grid list of favorites -->
        <div class="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          @for (vehicle of favoriteVehicles(); track vehicle.id) {
            <app-vehicle-card [vehicle]="vehicle"></app-vehicle-card>
          }
        </div>
      } @else {
        <!-- Empty State -->
        <div class="py-24 text-center border-2 border-dashed border-slate-200 rounded-3xl mt-8 bg-white max-w-2xl mx-auto px-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h2 class="font-heading text-xl font-bold text-slate-900 mt-6">Sin favoritos guardados</h2>
          <p class="text-slate-500 text-sm mt-2 max-w-sm mx-auto">
            Aún no has guardado ningún vehículo en tus favoritos. Explora nuestro catálogo y presiona el botón de corazón para guardarlos aquí.
          </p>
          <a routerLink="/catalogo" class="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500 transition-colors">
            Ir al Catálogo
          </a>
        </div>
      }

    </div>
  `
})
export class FavoritesComponent {
  private readonly favoriteService = inject(FavoriteService);
  private readonly vehicleService = inject(VehicleService);

  // Cross reference IDs with full objects reactively
  protected readonly favoriteVehicles = computed(() => {
    const ids = this.favoriteService.favorites();
    const all = this.vehicleService.vehicles();
    return all.filter(v => ids.includes(v.id));
  });
}
