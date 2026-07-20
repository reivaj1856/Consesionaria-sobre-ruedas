import { Component, input, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Vehicle } from '../../../core/models/vehicle.model';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ComparisonService } from '../../../core/services/comparison.service';

@Component({
  selector: 'app-vehicle-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DecimalPipe],
  template: `
    <div [routerLink]="['/vehiculo', vehicle().id]" 
    class="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-950/80">
      
      <!-- Card Image Header -->
      <div class="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
        <!-- Status Badge -->
        <span class="absolute top-3 left-3 z-10 inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wider shadow-sm"
              [class]="statusBadgeClass()">
          {{ statusText() }}
        </span>

        <!-- Condition Badge -->
        <span class="absolute top-3 right-3 z-10 inline-flex items-center rounded-md bg-white/95 dark:bg-slate-900/95 px-2.5 py-1 text-xs font-semibold capitalize text-slate-800 dark:text-slate-200 backdrop-blur-sm shadow-sm border border-slate-200/50 dark:border-slate-700/50">
          {{ vehicle().condicion }}
        </span>

        <!-- Image with Hover Zoom -->
        <img [src]="vehicle().imagenPrincipal" 
             [alt]="vehicle().nombre" 
             class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
             loading="lazy"/>
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
      </div>

      <!-- Card Body Content -->
      <div class="flex flex-1 flex-col p-5">
        
        <!-- Category & Title -->
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {{ vehicle().categoria }}
          </span>
          <span class="text-xs font-medium text-slate-400 dark:text-slate-500">
            Añadido: {{ vehicle().anio }}
          </span>
        </div>

        <h3 class="mt-2 font-heading text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          <a [routerLink]="['/vehiculo', vehicle().id]">
            {{ vehicle().nombre }}
          </a>
        </h3>

        <!-- Core specifications grid -->
        <div class="mt-4 grid grid-cols-3 gap-2 border-y border-slate-100 dark:border-slate-800 py-3 text-center text-xs text-slate-600 dark:text-slate-300">
          <div class="flex flex-col items-center">
            <span class="font-semibold text-slate-900 dark:text-white">{{ vehicle().kilometraje | number:'1.0-0' }}</span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tight">Km</span>
          </div>
          <div class="flex flex-col items-center border-x border-slate-100 dark:border-slate-800">
            <span class="font-semibold text-slate-900 dark:text-white truncate max-w-full px-1">{{ vehicle().transmision }}</span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tight">Caja</span>
          </div>
          <div class="flex flex-col items-center">
            <span class="font-semibold text-slate-900 dark:text-white truncate max-w-full px-1">{{ vehicle().tipoCombustible }}</span>
            <span class="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-tight">Motor</span>
          </div>
        </div>

        <!-- Price & CTA actions -->
        <div class="mt-5 flex items-center justify-between pt-1">
          <div>
            <p class="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold">Precio Contado</p>
            <p class="font-heading text-xl font-extrabold text-slate-900 dark:text-white">
              {{ vehicle().precio | currency:'USD':'symbol':'1.0-0' }}
            </p>
          </div>
          
          <div class="flex items-center gap-1.5">
            <!-- Favorite button -->
            <button (click)="toggleFavorite()"
                    class="flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus:outline-none"
                    [class]="isFavorite() ? 'border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950/50 text-red-500 hover:bg-red-100' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-red-500 hover:bg-slate-50 dark:hover:bg-slate-700'"
                    title="Añadir a Favoritos">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [attr.fill]="isFavorite() ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>

            <!-- Comparison button -->
            <button (click)="toggleComparison()"
                    class="flex h-10 w-10 items-center justify-center rounded-lg border transition-colors focus:outline-none"
                    [class]="isCompared() ? 'border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-400 hover:text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700'"
                    title="Comparar ficha técnica">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </button>

            <!-- Detail button -->
            <a  
               class="inline-flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
              Ficha
            </a>
          </div>
        </div>

      </div>
    </div>
  `
})
export class VehicleCardComponent {
  public readonly vehicle = input.required<Vehicle>();

  private readonly favoriteService = inject(FavoriteService);
  private readonly comparisonService = inject(ComparisonService);

  protected readonly isFavorite = computed(() => this.favoriteService.isFavorite(this.vehicle().id));
  protected readonly isCompared = computed(() => this.comparisonService.isCompared(this.vehicle().id));

  protected readonly statusText = computed(() => {
    const estado = this.vehicle().estado;
    if (estado === 'disponible') return 'Disponible';
    if (estado === 'reservado') return 'Reservado';
    return 'Vendido';
  });

  protected readonly statusBadgeClass = computed(() => {
    const estado = this.vehicle().estado;
    if (estado === 'disponible') return 'bg-emerald-500 text-white';
    if (estado === 'reservado') return 'bg-amber-500 text-white';
    return 'bg-rose-500 text-white';
  });

  protected toggleFavorite(): void {
    this.favoriteService.toggleFavorite(this.vehicle().id);
  }

  protected toggleComparison(): void {
    this.comparisonService.toggleComparison(this.vehicle());
  }
}
