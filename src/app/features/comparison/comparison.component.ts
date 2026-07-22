import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { ComparisonService } from '../../core/services/comparison.service';
import { Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, DecimalPipe],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 class="font-heading text-3xl font-extrabold text-slate-900 dark:text-white">Comparador Técnico</h1>
        <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Compara características técnicas de hasta 3 vehículos simultáneamente</p>
      </div>

      @if (vehicles().length > 0) {
        
        <!-- Comparison Desk Layout -->
        <div class="mt-8 overflow-x-auto">
          <div class="min-w-[800px] border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm dark:shadow-slate-950/20">
            
            <table class="w-full table-fixed border-collapse">
              <thead>
                <tr class="bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-200 dark:border-slate-800">
                  <th class="w-1/4 p-6 text-left font-heading font-bold text-slate-900 dark:text-slate-100 text-sm">Ficha Comparativa</th>
                  @for (v of vehicles(); track v.id) {
                    <th class="w-1/4 p-6 text-left relative">
                      <button (click)="remove(v.id)" 
                              class="absolute top-4 right-4 text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 rounded-full p-1 bg-slate-100/50 dark:bg-slate-850/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                              title="Quitar de comparación">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>

                      <div class="aspect-video w-full rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 mb-4">
                        <img [src]="v.imagenPrincipal" class="h-full w-full object-cover" [alt]="v.nombre" />
                      </div>
                      
                      <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">{{ v.categoria }}</span>
                      <h3 class="font-heading font-bold text-slate-900 dark:text-white text-base mt-1 line-clamp-1">
                        <a [routerLink]="['/vehiculo', v.id]" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">{{ v.nombre }}</a>
                      </h3>
                      <p class="font-heading font-extrabold text-slate-900 dark:text-white mt-2 text-lg">
                        {{ v.precio | currency:'USD':'symbol':'1.0-0' }}
                      </p>
                      
                      <a [routerLink]="['/vehiculo', v.id]" 
                         class="mt-4 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-sm transition-colors">
                        Ver Detalles
                      </a>
                    </th>
                  }
                  
                  <!-- Fill empty columns if less than 3 compared -->
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <th class="w-1/4 p-6 text-center bg-slate-50/20 dark:bg-slate-900/10">
                        <div class="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl h-56 p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <p class="text-xs text-slate-400 dark:text-slate-500 mt-2">Agregar vehículo</p>
                          <a routerLink="/catalogo" class="mt-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">
                            Ir al Catálogo
                          </a>
                        </div>
                      </th>
                    }
                  }
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                
                <!-- Base Specs Rows -->
                <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                  <td class="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">Marca / Modelo</td>
                  @for (v of vehicles(); track v.id) {
                    <td class="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{{ v.marca }} / {{ v.modelo }}</td>
                  }
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                    }
                  }
                </tr>

                <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                  <td class="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">Año Modelo</td>
                  @for (v of vehicles(); track v.id) {
                    <td class="p-4 text-sm font-medium text-slate-800 dark:text-slate-300">{{ v.anio }}</td>
                  }
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                    }
                  }
                </tr>

                <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                  <td class="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">Kilometraje</td>
                  @for (v of vehicles(); track v.id) {
                    <td class="p-4 text-sm font-medium text-slate-800 dark:text-slate-300">{{ v.kilometraje | number:'1.0-0' }} km</td>
                  }
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                    }
                  }
                </tr>

                <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                  <td class="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">Transmisión</td>
                  @for (v of vehicles(); track v.id) {
                    <td class="p-4 text-sm font-medium text-slate-800 dark:text-slate-300">{{ v.transmision }}</td>
                  }
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                    }
                  }
                </tr>

                <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                  <td class="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">Combustible</td>
                  @for (v of vehicles(); track v.id) {
                    <td class="p-4 text-sm font-medium text-slate-800 dark:text-slate-300">{{ v.tipoCombustible }}</td>
                  }
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                    }
                  }
                </tr>

                <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                  <td class="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">Condición</td>
                  @for (v of vehicles(); track v.id) {
                    <td class="p-4 text-sm font-semibold capitalize text-slate-800 dark:text-slate-300">{{ v.condicion }}</td>
                  }
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                    }
                  }
                </tr>

                <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                  <td class="p-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">Ubicación</td>
                  @for (v of vehicles(); track v.id) {
                    <td class="p-4 text-sm text-slate-700 dark:text-slate-300">{{ v.ubicacion }}</td>
                  }
                  @if (vehicles().length < 3) {
                    @for (empty of [].constructor(3 - vehicles().length); track $index) {
                      <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                    }
                  }
                </tr>

                <!-- Dynamic Specifications Compilation Row Header -->
                <tr>
                  <td colspan="4" class="bg-slate-100/70 dark:bg-slate-800 p-3 text-xs font-extrabold uppercase text-slate-900 dark:text-slate-200 tracking-widest pl-4">Ficha Técnica Extendida</td>
                </tr>

                <!-- Dynamic Spec rows -->
                @for (specKey of allSpecKeys(); track specKey) {
                  <tr class="hover:bg-slate-50/30 dark:hover:bg-slate-850/30">
                    <td class="p-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide bg-slate-50/40 dark:bg-slate-900/30">{{ specKey }}</td>
                    @for (v of vehicles(); track v.id) {
                      <td class="p-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {{ hasSpecification(v, specKey) ? 'Sí' : '-' }}
                      </td>
                    }
                    @if (vehicles().length < 3) {
                      @for (empty of [].constructor(3 - vehicles().length); track $index) {
                        <td class="p-4 bg-slate-50/10 dark:bg-slate-900/10"></td>
                      }
                    }
                  </tr>
                }

              </tbody>
            </table>

          </div>
        </div>

        <div class="mt-8 flex justify-end">
          <button (click)="clearAll()" class="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-700 dark:hover:text-red-300 px-5 py-2.5 text-sm font-semibold transition-all">
            Limpiar comparador
          </button>
        </div>

      } @else {
        <!-- Empty State -->
        <div class="py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-850 rounded-3xl mt-8 bg-white dark:bg-slate-900/50 max-w-2xl mx-auto px-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-16 w-16 text-slate-300 dark:text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
          </svg>
          <h2 class="font-heading text-xl font-bold text-slate-900 dark:text-white mt-6">Comparador vacío</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-sm mx-auto">
            Aún no has agregado ningún auto, moto o maquinaria al comparador. Explora nuestro catálogo y presiona el botón de comparación en las tarjetas.
          </p>
          <a routerLink="/catalogo" class="mt-6 inline-flex items-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500 transition-colors">
            Ir al Catálogo de Vehículos
          </a>
        </div>
      }
    </div>
  `
})
export class ComparisonComponent {
  private readonly comparisonService = inject(ComparisonService);
  
  protected readonly vehicles = this.comparisonService.comparedVehicles;

  protected readonly allSpecKeys = computed(() => {
    const list = this.vehicles();
    const names = new Set<string>();
    
    list.forEach(v => {
      if (v.especificaciones) {
        v.especificaciones.forEach(spec => {
          names.add(spec.nombre);
        });
      }
    });

    return Array.from(names);
  });

  protected hasSpecification(v: Vehicle, name: string): boolean {
    if (!v.especificaciones) return false;
    return v.especificaciones.some(s => s.nombre === name);
  }

  protected remove(id: string): void {
    this.comparisonService.removeVehicle(id);
  }

  protected clearAll(): void {
    this.comparisonService.clear();
  }
}
