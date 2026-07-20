import { Component, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../../core/services/vehicle.service';
import { Vehicle } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, CurrencyPipe],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Admin Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900">Panel de Administración</h1>
          <p class="mt-2 text-sm text-slate-500">Gestión global de inventario, estados y visibilidad de vehículos destacados</p>
        </div>
        
        <div class="flex gap-2 shrink-0">
          <a routerLink="/admin/usuarios" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Gestionar Usuarios
          </a>
          <a routerLink="/admin/carrusel" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Gestionar Portadas
          </a>
          <a routerLink="/admin/especificaciones" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            Gestionar Características
          </a>
          <a routerLink="/admin/crear" 
             class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Nuevo Vehículo
          </a>
        </div>
      </div>

      <!-- Filters & Stats Cards -->
      <div class="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Total Inventario</span>
          <p class="font-heading text-2xl font-extrabold text-slate-900 mt-1">{{ totalCount() }} unidades</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Destacados en Home</span>
          <p class="font-heading text-2xl font-extrabold text-blue-600 mt-1">{{ featuredCount() }} unidades</p>
        </div>
        <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <span class="text-xs font-semibold text-slate-400 uppercase">Reservados / Vendidos</span>
          <p class="font-heading text-2xl font-extrabold text-amber-600 mt-1">{{ inactiveCount() }} unidades</p>
        </div>
      </div>

      <!-- Action Bar -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-100 p-4 rounded-xl border border-slate-200">
        <div class="relative w-full sm:max-w-xs">
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por marca, modelo..." 
                 class="w-full bg-white rounded-lg border border-slate-200 pl-9 pr-4 py-2 text-xs focus:outline-none focus:border-blue-500" />
        </div>

        <div class="flex gap-2">
          <button (click)="clearSearch()" class="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-2 bg-white rounded-lg border border-slate-200 shadow-sm">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Inventory Table -->
      <div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-100">
            <thead class="bg-slate-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehículo</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio (USD)</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Destacado</th>
                <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            
            <tbody class="divide-y divide-slate-100">
              @for (v of filteredVehicles(); track v.id) {
                <tr class="hover:bg-slate-50/50 transition-colors">
                  <!-- Product Identity -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <div class="flex items-center gap-3">
                      <div class="h-10 w-14 shrink-0 overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                        <img [src]="v.imagenPrincipal" [alt]="v.nombre" class="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div class="text-sm font-bold text-slate-900">{{ v.nombre }}</div>
                        <div class="text-xs text-slate-400">{{ v.marca }} · {{ v.modelo }} · {{ v.anio }}</div>
                      </div>
                    </div>
                  </td>
                  
                  <!-- Category -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <span class="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 capitalize ring-1 ring-inset ring-blue-700/10">
                      {{ v.categoria }}
                    </span>
                  </td>
                  
                  <!-- Price -->
                  <td class="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                    {{ v.precio | currency:'USD':'symbol':'1.0-0' }}
                  </td>
                  
                  <!-- Featured Checkbox -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <button (click)="toggleFeatured(v.id, v.destacado)" 
                            class="flex h-8 w-8 items-center justify-center rounded-lg border transition-colors hover:bg-slate-50"
                            [class.text-amber-500]="v.destacado"
                            [class.text-slate-300]="!v.destacado">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [attr.fill]="v.destacado ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.252.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.77-.558-.371-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </button>
                  </td>

                  <!-- Status Select -->
                  <td class="whitespace-nowrap px-6 py-4">
                    <select [ngModel]="v.estado" (ngModelChange)="changeStatus(v.id, $event)"
                            class="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-semibold focus:outline-none transition-colors shadow-sm"
                            [class]="statusSelectClass(v.estado)">
                      <option value="disponible">Disponible</option>
                      <option value="reservado">Reservado</option>
                      <option value="vendido">Vendido</option>
                    </select>
                  </td>

                  <!-- Actions buttons -->
                  <td class="whitespace-nowrap px-6 py-4 text-right text-xs font-medium space-x-2">
                    <a [routerLink]="['/admin/editar', v.id]" class="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
                      Editar
                    </a>
                    <button (click)="deleteItem(v.id, v.nombre)" class="inline-flex rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 font-bold text-red-600 hover:bg-red-100 shadow-sm transition-colors">
                      Eliminar
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="6" class="px-6 py-12 text-center text-slate-500">
                    No se encontraron vehículos en el stock.
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `
})
export class AdminDashboardComponent {
  private readonly vehicleService = inject(VehicleService);

  protected readonly searchQuery = signal('');

  protected readonly allVehicles = this.vehicleService.vehicles;

  protected readonly totalCount = computed(() => this.allVehicles().length);
  protected readonly featuredCount = computed(() => this.allVehicles().filter(v => v.destacado).length);
  protected readonly inactiveCount = computed(() => this.allVehicles().filter(v => v.estado !== 'disponible').length);

  protected readonly filteredVehicles = computed(() => {
    const list = this.allVehicles();
    const query = this.searchQuery().trim().toLowerCase();
    if (!query) return list;
    
    return list.filter(v => 
      v.nombre.toLowerCase().includes(query) ||
      v.marca.toLowerCase().includes(query) ||
      v.modelo.toLowerCase().includes(query) ||
      v.categoria.toLowerCase().includes(query)
    );
  });

  protected clearSearch(): void {
    this.searchQuery.set('');
  }

  protected toggleFeatured(id: string, current: boolean): void {
    this.vehicleService.updateVehicle(id, { destacado: !current });
  }

  protected changeStatus(id: string, newStatus: 'disponible' | 'reservado' | 'vendido'): void {
    this.vehicleService.updateVehicle(id, { estado: newStatus });
  }

  protected deleteItem(id: string, name: string): void {
    if (confirm(`¿Estás seguro de que deseas eliminar permanentemente el vehículo "${name}" del stock?`)) {
      this.vehicleService.deleteVehicle(id);
    }
  }

  protected statusSelectClass(status: string): string {
    if (status === 'disponible') return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (status === 'reservado') return 'text-amber-700 bg-amber-50 border-amber-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  }
}
