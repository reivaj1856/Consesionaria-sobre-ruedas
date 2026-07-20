import { Component, inject, signal, computed, effect } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { Vehicle } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleCardComponent],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Breadcrumb & Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900">Catálogo de Vehículos</h1>
          <p class="mt-2 text-sm text-slate-500">Explora nuestro inventario con filtros de precisión avanzada</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="toggleMobileFilters()" class="md:hidden inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
            Filtros
          </button>
          
          <select [(ngModel)]="sortBy" (change)="resetPagination()"
                  class="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none">
            <option value="reciente">Más recientes</option>
            <option value="precio_asc">Precio: de menor a mayor</option>
            <option value="precio_desc">Precio: de mayor a menor</option>
            <option value="kilometraje_asc">Kilometraje: menor primero</option>
          </select>
        </div>
      </div>

      <!-- Main Grid with Sidebar and Products -->
      <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        
        <!-- Desktop Filter Sidebar -->
        <aside class="hidden lg:block space-y-6">
          <div class="sticky top-24 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div class="flex items-center justify-between">
              <h2 class="font-heading text-lg font-bold text-slate-900">Filtros Avanzados</h2>
              <button (click)="clearFilters()" class="text-xs font-semibold text-blue-600 hover:text-blue-500">
                Limpiar todo
              </button>
            </div>
            
            <div class="mt-6 space-y-6">
              <!-- Categoria -->
              <div>
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categoría</label>
                <div class="mt-2.5 space-y-2">
                  <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="category" value="" [(ngModel)]="filterCategory" (change)="resetPagination()" class="text-blue-600 focus:ring-blue-500" />
                    <span>Todas las categorías</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="category" value="autos" [(ngModel)]="filterCategory" (change)="resetPagination()" class="text-blue-600 focus:ring-blue-500" />
                    <span>Autos y Camionetas</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="category" value="motos" [(ngModel)]="filterCategory" (change)="resetPagination()" class="text-blue-600 focus:ring-blue-500" />
                    <span>Motocicletas</span>
                  </label>
                  <label class="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
                    <input type="radio" name="category" value="maquinaria" [(ngModel)]="filterCategory" (change)="resetPagination()" class="text-blue-600 focus:ring-blue-500" />
                    <span>Maquinaria Pesada</span>
                  </label>
                </div>
              </div>

              <!-- Buscar -->
              <div>
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Buscar por Texto</label>
                <input type="text" [(ngModel)]="filterText" (ngModelChange)="resetPagination()" placeholder="Marca, modelo..." 
                       class="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors" />
              </div>

              <!-- Marca -->
              <div>
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Marca</label>
                <select [(ngModel)]="filterBrand" (change)="resetPagination()"
                        class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
                  <option value="">Todas las marcas</option>
                  @for (brand of uniqueBrands(); track brand) {
                    <option [value]="brand">{{ brand }}</option>
                  }
                </select>
              </div>

              <!-- Precio rango -->
              <div>
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Precio Rango (USD)</label>
                <div class="mt-2 flex items-center gap-2">
                  <input type="number" [(ngModel)]="filterMinPrice" (ngModelChange)="resetPagination()" placeholder="Min" 
                         class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none" />
                  <span class="text-slate-400">-</span>
                  <input type="number" [(ngModel)]="filterMaxPrice" (ngModelChange)="resetPagination()" placeholder="Max" 
                         class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none" />
                </div>
              </div>

              <!-- Condición -->
              <div>
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Condición</label>
                <select [(ngModel)]="filterCondition" (change)="resetPagination()"
                        class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
                  <option value="">Cualquiera</option>
                  <option value="nuevo">Nuevo (0 Km)</option>
                  <option value="usado">Usado</option>
                </select>
              </div>

              <!-- Transmisión -->
              <div>
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Transmisión</label>
                <select [(ngModel)]="filterTransmission" (change)="resetPagination()"
                        class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
                  <option value="">Todas</option>
                  <option value="Manual">Manual</option>
                  <option value="Automática">Automática</option>
                  <option value="Hidrostática">Hidrostática</option>
                </select>
              </div>

              <!-- Combustible -->
              <div>
                <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Combustible</label>
                <select [(ngModel)]="filterFuel" (change)="resetPagination()"
                        class="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
                  <option value="">Todos</option>
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                </select>
              </div>
            </div>
          </div>
        </aside>

        <!-- Product Grid & Pagination Area -->
        <main class="lg:col-span-3">
          
          <!-- Active filters details banner -->
          <div class="mb-4 text-xs text-slate-500 flex items-center justify-between">
            <span>Mostrando {{ paginatedVehicles().length }} de {{ filteredVehicles().length }} vehículos encontrados</span>
            @if (hasActiveFilters()) {
              <button (click)="clearFilters()" class="text-blue-600 hover:underline">Remover todos los filtros</button>
            }
          </div>

          <!-- Product Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            @for (vehicle of paginatedVehicles(); track vehicle.id) {
              <app-vehicle-card [vehicle]="vehicle"></app-vehicle-card>
            } @empty {
              <div class="col-span-full rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="mt-4 text-sm font-semibold text-slate-900">No hay resultados</h3>
                <p class="mt-1 text-xs text-slate-500">Prueba ajustando tus parámetros de filtros o buscando con otro término.</p>
                <button (click)="clearFilters()" class="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-500">
                  Limpiar Filtros
                </button>
              </div>
            }
          </div>

          <!-- Pagination Controls -->
          @if (totalPages() > 1) {
            <div class="mt-12 flex items-center justify-center gap-2 border-t border-slate-100 pt-6">
              <button (click)="prevPage()" [disabled]="currentPage() === 1"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              @for (page of pageNumbers(); track page) {
                <button (click)="setPage(page)"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm font-semibold transition-colors"
                        [class]="currentPage() === page 
                                  ? 'border-blue-600 bg-blue-600 text-white shadow-sm' 
                                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'">
                  {{ page }}
                </button>
              }

              <button (click)="nextPage()" [disabled]="currentPage() === totalPages()"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 shadow-sm hover:bg-slate-50 disabled:opacity-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          }

        </main>
      </div>

      <!-- Mobile Filters Slide-out Modal/Drawer -->
      @if (isMobileFiltersOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm lg:hidden">
          <div class="min-h-full flex items-center justify-end">
            <div class="w-full max-w-sm bg-white p-6 min-h-full shadow-2xl flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 class="font-heading text-lg font-bold text-slate-900">Filtros</h3>
                  <button (click)="toggleMobileFilters()" class="text-slate-400 hover:text-slate-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div class="mt-4 space-y-5">
                  <!-- Categoria -->
                  <div>
                    <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categoría</label>
                    <select [(ngModel)]="filterCategory" (change)="resetPagination()" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                      <option value="">Todas</option>
                      <option value="autos">Autos y Camionetas</option>
                      <option value="motos">Motocicletas</option>
                      <option value="maquinaria">Maquinaria Pesada</option>
                    </select>
                  </div>

                  <!-- Buscar -->
                  <div>
                    <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Buscar</label>
                    <input type="text" [(ngModel)]="filterText" (ngModelChange)="resetPagination()" placeholder="Marca, modelo..." class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                  </div>

                  <!-- Marca -->
                  <div>
                    <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Marca</label>
                    <select [(ngModel)]="filterBrand" (change)="resetPagination()" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                      <option value="">Todas las marcas</option>
                      @for (brand of uniqueBrands(); track brand) {
                        <option [value]="brand">{{ brand }}</option>
                      }
                    </select>
                  </div>

                  <!-- Precios -->
                  <div>
                    <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Precios (USD)</label>
                    <div class="mt-1 flex gap-2">
                      <input type="number" [(ngModel)]="filterMinPrice" (ngModelChange)="resetPagination()" placeholder="Min" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                      <input type="number" [(ngModel)]="filterMaxPrice" (ngModelChange)="resetPagination()" placeholder="Max" class="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm" />
                    </div>
                  </div>

                  <!-- Condición -->
                  <div>
                    <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Condición</label>
                    <select [(ngModel)]="filterCondition" (change)="resetPagination()" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                      <option value="">Todas</option>
                      <option value="nuevo">Nuevo</option>
                      <option value="usado">Usado</option>
                    </select>
                  </div>
                </div>
              </div>

              <div class="mt-8 border-t border-slate-100 pt-4 flex gap-3">
                <button (click)="clearFilters(); toggleMobileFilters()" class="w-1/2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Limpiar Todo
                </button>
                <button (click)="toggleMobileFilters()" class="w-1/2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-blue-500">
                  Aplicar
                </button>
              </div>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class CatalogComponent {
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  // Filter States
  protected readonly filterCategory = signal<string>('');
  protected readonly filterText = signal<string>('');
  protected readonly filterBrand = signal<string>('');
  protected readonly filterMinPrice = signal<number | null>(null);
  protected readonly filterMaxPrice = signal<number | null>(null);
  protected readonly filterCondition = signal<string>('');
  protected readonly filterTransmission = signal<string>('');
  protected readonly filterFuel = signal<string>('');
  protected readonly sortBy = signal<string>('reciente');

  // Pagination States
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = 6;

  // UI state
  protected readonly isMobileFiltersOpen = signal(false);

  constructor() {
    // Escuchar parámetros de ruta (ej. buscador en Home o click en categorías)
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.filterCategory.set(params['categoria']);
      }
      if (params['buscar']) {
        this.filterText.set(params['buscar']);
      }
      this.resetPagination();
    });
  }

  // Dynamic brand selection based on current category
  protected readonly uniqueBrands = computed(() => {
    const cat = this.filterCategory();
    const list = this.vehicleService.vehicles();
    const filteredByCat = cat ? list.filter(v => v.categoria === cat) : list;
    return Array.from(new Set(filteredByCat.map(v => v.marca))).sort();
  });

  // Main list filtered
  protected readonly filteredVehicles = computed(() => {
    let result = [...this.vehicleService.vehicles()];

    // Categoría
    if (this.filterCategory()) {
      result = result.filter(v => v.categoria === this.filterCategory());
    }

    // Texto de Búsqueda
    if (this.filterText()) {
      const q = this.filterText().toLowerCase();
      result = result.filter(v => 
        v.nombre.toLowerCase().includes(q) || 
        v.marca.toLowerCase().includes(q) || 
        v.modelo.toLowerCase().includes(q) ||
        v.descripcion.toLowerCase().includes(q)
      );
    }

    // Marca
    if (this.filterBrand()) {
      result = result.filter(v => v.marca === this.filterBrand());
    }

    // Precios
    if (this.filterMinPrice() !== null) {
      result = result.filter(v => v.precio >= this.filterMinPrice()!);
    }
    if (this.filterMaxPrice() !== null) {
      result = result.filter(v => v.precio <= this.filterMaxPrice()!);
    }

    // Condición
    if (this.filterCondition()) {
      result = result.filter(v => v.condicion === this.filterCondition());
    }

    // Transmisión
    if (this.filterTransmission()) {
      result = result.filter(v => v.transmision === this.filterTransmission());
    }

    // Combustible
    if (this.filterFuel()) {
      result = result.filter(v => v.tipoCombustible === this.filterFuel());
    }

    // Ordenamiento
    if (this.sortBy() === 'precio_asc') {
      result.sort((a, b) => a.precio - b.precio);
    } else if (this.sortBy() === 'precio_desc') {
      result.sort((a, b) => b.precio - a.precio);
    } else if (this.sortBy() === 'kilometraje_asc') {
      result.sort((a, b) => a.kilometraje - b.kilometraje);
    } else {
      // reciente: orden inverso por fechaIngreso o id
      result.sort((a, b) => b.fechaIngreso.localeCompare(a.fechaIngreso));
    }

    return result;
  });

  // Paginated List
  protected readonly paginatedVehicles = computed(() => {
    const list = this.filteredVehicles();
    const start = (this.currentPage() - 1) * this.pageSize;
    return list.slice(start, start + this.pageSize);
  });

  protected readonly totalPages = computed(() => {
    return Math.ceil(this.filteredVehicles().length / this.pageSize);
  });

  protected readonly pageNumbers = computed(() => {
    const pages = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  });

  protected readonly hasActiveFilters = computed(() => {
    return this.filterCategory() !== '' || 
           this.filterText() !== '' || 
           this.filterBrand() !== '' || 
           this.filterMinPrice() !== null || 
           this.filterMaxPrice() !== null || 
           this.filterCondition() !== '' ||
           this.filterTransmission() !== '' ||
           this.filterFuel() !== '';
  });

  protected toggleMobileFilters(): void {
    this.isMobileFiltersOpen.update(v => !v);
  }

  protected clearFilters(): void {
    this.filterCategory.set('');
    this.filterText.set('');
    this.filterBrand.set('');
    this.filterMinPrice.set(null);
    this.filterMaxPrice.set(null);
    this.filterCondition.set('');
    this.filterTransmission.set('');
    this.filterFuel.set('');
    this.sortBy.set('reciente');
    
    // Remover parámetros de la url
    this.router.navigate([], { queryParams: {} });
    this.resetPagination();
  }

  protected resetPagination(): void {
    this.currentPage.set(1);
  }

  protected setPage(page: number): void {
    this.currentPage.set(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  protected prevPage(): void {
    if (this.currentPage() > 1) {
      this.setPage(this.currentPage() - 1);
    }
  }

  protected nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.setPage(this.currentPage() + 1);
    }
  }
}
