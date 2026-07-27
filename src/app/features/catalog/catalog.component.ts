import { Component, inject, signal, computed, effect, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { Vehicle, getCategoryLabel } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [CommonModule, FormsModule, VehicleCardComponent, CurrencyPipe, RouterLink],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Recommended Category Vehicles Carousel (Home Style, Edge-to-Edge) -->
      @if (recommendedCategoryVehicles().length > 0) {
        <section class="relative bg-slate-950 text-white overflow-hidden h-[360px] md:h-[440px] -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 mb-6 border-b border-slate-900 z-0">
          
          <!-- Slides Wrapper -->
          @for (item of recommendedCategoryVehicles(); track item.id) {
            <div class="absolute inset-0 transition-opacity duration-700 ease-in-out"
                 [class.opacity-100]="activeSlide() === $index"
                 [class.opacity-0]="activeSlide() !== $index"
                 [class.pointer-events-none]="activeSlide() !== $index">
              
              <!-- Background Image -->
              <img [src]="item.imagenPrincipal" class="h-full w-full object-cover" [alt]="item.nombre" />
              
              <!-- Gradient Overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
              
              <!-- Slide Content Box (Floating Card, Bottom-left aligned) -->
              <div class="absolute inset-x-0 bottom-0 z-10 pb-8 sm:pb-10">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-start">
                  <a [routerLink]="['/vehiculo', item.id]" 
                     class="max-w-xs sm:max-w-sm bg-slate-950/60 backdrop-blur-md border border-white/15 p-4 rounded-xl shadow-2xl transition-all duration-500 hover:border-white/30 block cursor-pointer">
                    
                    <!-- Badge -->
                    <span class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-2 py-0.5 text-[9px] font-bold text-white uppercase tracking-wider shadow-sm">
                      Recomendado en {{ getCategoryLabel(filterCategory()) }}
                    </span>

                    <!-- Title -->
                    <h3 class="mt-2 font-heading text-base font-extrabold tracking-tight text-white leading-snug hover:text-blue-400 transition-colors line-clamp-1">
                      {{ item.nombre }}
                    </h3>

                    <!-- Price -->
                    <p class="mt-1 text-sm font-black text-blue-400">
                      {{ getVehicleDisplayedPrice(item, displayCurrency()) | currency:displayCurrency():(displayCurrency() === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
                    </p>

                  </a>
                </div>
              </div>
              
            </div>
          }

          <!-- Carousel Indicators -->
          @if (recommendedCategoryVehicles().length > 1) {
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-1.5 p-1 rounded-full bg-slate-950/40 backdrop-blur-sm border border-white/10">
              @for (item of recommendedCategoryVehicles(); track item.id) {
                <button (click)="setSlide($index)" 
                        class="h-1 transition-all duration-300 focus:outline-none cursor-pointer"
                        [class.w-4]="activeSlide() === $index"
                        [class.bg-blue-500]="activeSlide() === $index"
                        [class.w-1]="activeSlide() !== $index"
                        [class.bg-white/40]="activeSlide() !== $index">
                </button>
              }
            </div>
          }

          <!-- Carousel Navigation Arrows -->
          @if (recommendedCategoryVehicles().length > 1) {
            <button (click)="prevSlide()" class="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-slate-950/30 hover:bg-slate-950/60 backdrop-blur-sm border border-white/10 text-white focus:outline-none flex items-center justify-center transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button (click)="nextSlide()" class="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-lg bg-slate-950/30 hover:bg-slate-950/60 backdrop-blur-sm border border-white/10 text-white focus:outline-none flex items-center justify-center transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          }

        </section>
      }

      <!-- Category Tabs (Horizontal pills at top if category is not locked) -->
      @if (!isCategoryLocked()) {
        <div class="flex gap-2 overflow-x-auto pb-2.5 mt-2 scrollbar-hide mb-4">
          <button (click)="filterCategory.set(''); resetPagination()"
                  [class]="filterCategory() === '' ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'"
                  class="rounded-full px-4.5 py-1.5 text-xs transition-all shadow-sm shrink-0 cursor-pointer">
            Todas las Categorías
          </button>
          <button (click)="filterCategory.set('autos'); resetPagination()"
                  [class]="filterCategory() === 'autos' ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'"
                  class="rounded-full px-4.5 py-1.5 text-xs transition-all shadow-sm shrink-0 cursor-pointer">
            Autos
          </button>
          <button (click)="filterCategory.set('autos_electricos'); resetPagination()"
                  [class]="filterCategory() === 'autos_electricos' ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'"
                  class="rounded-full px-4.5 py-1.5 text-xs transition-all shadow-sm shrink-0 cursor-pointer">
            Autos Eléctricos
          </button>
          <button (click)="filterCategory.set('motos'); resetPagination()"
                  [class]="filterCategory() === 'motos' ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'"
                  class="rounded-full px-4.5 py-1.5 text-xs transition-all shadow-sm shrink-0 cursor-pointer">
            Motocicletas
          </button>
          <button (click)="filterCategory.set('motos_electricos'); resetPagination()"
                  [class]="filterCategory() === 'motos_electricos' ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'"
                  class="rounded-full px-4.5 py-1.5 text-xs transition-all shadow-sm shrink-0 cursor-pointer">
            Motos Eléctricas
          </button>
          <button (click)="filterCategory.set('maquinaria_agricola'); resetPagination()"
                  [class]="filterCategory() === 'maquinaria_agricola' ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'"
                  class="rounded-full px-4.5 py-1.5 text-xs transition-all shadow-sm shrink-0 cursor-pointer">
            Maquinaria Agrícola
          </button>
          <button (click)="filterCategory.set('transporte_pesado'); resetPagination()"
                  [class]="filterCategory() === 'transporte_pesado' ? 'bg-blue-600 text-white font-semibold' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'"
                  class="rounded-full px-4.5 py-1.5 text-xs transition-all shadow-sm shrink-0 cursor-pointer">
            Transporte Pesado
          </button>
        </div>
      }

      <!-- Horizontal Filter Bar -->
      <div class="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 shadow-sm mt-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7 gap-4 items-end">
          
          <!-- Mostrar Precios En -->
          <div>
            <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Moneda</label>
            <div class="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200/50 dark:border-slate-700/30">
              <button type="button" 
                      (click)="setDisplayCurrency('BOB')"
                      [class]="displayCurrency() === 'BOB' 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold' 
                        : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
                      class="text-center py-1 text-[11px] rounded-md transition-all focus:outline-none cursor-pointer">
                Bs
              </button>
              <button type="button" 
                      (click)="setDisplayCurrency('USD')"
                      [class]="displayCurrency() === 'USD' 
                        ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold' 
                        : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
                      class="text-center py-1 text-[11px] rounded-md transition-all focus:outline-none cursor-pointer">
                USD
              </button>
            </div>
          </div>

          <!-- Buscar por texto -->
          <div>
            <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Buscar</label>
            <input type="text" [(ngModel)]="filterText" (ngModelChange)="resetPagination()" placeholder="Marca, modelo..." 
                   class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none" />
          </div>

          <!-- Condición -->
          <div>
            <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Condición</label>
            <select [(ngModel)]="filterCondition" (change)="resetPagination()"
                    class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none">
              <option value="">Cualquiera</option>
              <option value="nuevo">Nuevo</option>
              <option value="usado">Usado</option>
            </select>
          </div>

          <!-- Marca -->
          <div>
            <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Marca</label>
            <select [(ngModel)]="filterBrand" (change)="resetPagination()"
                    class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none">
              <option value="">Todas las marcas</option>
              @for (brand of uniqueBrands(); track brand) {
                <option [value]="brand">{{ brand }}</option>
              }
            </select>
          </div>

          <!-- Rango de Precios -->
          <div class="flex items-center gap-1.5">
            <div class="flex-1">
              <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Costo Mín</label>
              <input type="number" [(ngModel)]="filterMinPrice" (ngModelChange)="resetPagination()" placeholder="Min" 
                     class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none" />
            </div>
            <span class="text-slate-300 dark:text-slate-700 self-center mt-4">-</span>
            <div class="flex-1">
              <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Costo Máx</label>
              <input type="number" [(ngModel)]="filterMaxPrice" (ngModelChange)="resetPagination()" placeholder="Max" 
                     class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none" />
            </div>
          </div>

          <!-- Ordenar Por -->
          <div>
            <label class="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">Ordenar</label>
            <select [(ngModel)]="sortBy" (change)="resetPagination()"
                    class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-800 dark:text-white focus:border-blue-500 focus:outline-none">
              <option value="reciente">Más recientes</option>
              <option value="precio_asc">Precio: menor a mayor</option>
              <option value="precio_desc">Precio: mayor a menor</option>
              <option value="kilometraje_asc">Kilometraje: menor primero</option>
            </select>
          </div>

          <!-- Botón de Limpiar -->
          <div>
            <button (click)="clearFilters()" 
                    class="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700/80 py-1.5 text-xs font-bold text-slate-700 dark:text-white cursor-pointer transition-colors">
              Limpiar
            </button>
          </div>

        </div>
      </div>

      <!-- Main Products Container -->
      <div class="mt-8">
        <main class="w-full">
          
          <!-- Active filters details banner -->
          <div class="mb-4 text-xs text-slate-500 flex items-center justify-between">
            <span>Mostrando {{ paginatedVehicles().length }} de {{ filteredVehicles().length }} vehículos encontrados</span>
            @if (hasActiveFilters()) {
              <button (click)="clearFilters()" class="text-blue-600 hover:underline">Remover todos los filtros</button>
            }
          </div>

          <!-- Product Grid -->
          <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            @for (vehicle of paginatedVehicles(); track vehicle.id) {
              <app-vehicle-card [vehicle]="vehicle" [displayCurrency]="displayCurrency()"></app-vehicle-card>
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
                  <!-- Mostrar Precios En (Mobile) -->
                  <div>
                    <label class="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Mostrar Precios En</label>
                    <div class="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200/50 dark:border-slate-700/30">
                      <button type="button" 
                              (click)="setDisplayCurrency('BOB')"
                              [class]="displayCurrency() === 'BOB' 
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold' 
                                : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
                              class="text-center py-1.5 text-xs rounded-lg transition-all focus:outline-none cursor-pointer">
                        Bolivianos
                      </button>
                      <button type="button" 
                              (click)="setDisplayCurrency('USD')"
                              [class]="displayCurrency() === 'USD' 
                                ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm font-semibold' 
                                : 'bg-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 font-medium'"
                              class="text-center py-1.5 text-xs rounded-lg transition-all focus:outline-none cursor-pointer">
                        Dólares
                      </button>
                    </div>
                  </div>
                  <!-- Categoria -->
                  @if (!isCategoryLocked()) {
                    <div>
                      <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Categoría</label>
                      <select [(ngModel)]="filterCategory" (change)="resetPagination()" class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                        <option value="">Todas</option>
                        <option value="autos">Autos</option>
                        <option value="autos_electricos">Autos Eléctricos</option>
                        <option value="motos">Motos</option>
                        <option value="motos_electricos">Motos Eléctricas</option>
                        <option value="maquinaria_agricola">Maquinaria Agrícola</option>
                        <option value="transporte_pesado">Transporte Pesado</option>
                      </select>
                    </div>
                  }

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
                    <label class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Precios ({{ displayCurrency() }})</label>
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
export class CatalogComponent implements OnInit, OnDestroy {
  private readonly vehicleService = inject(VehicleService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly getCategoryLabel = getCategoryLabel;

  // Carousel Signals and Fields
  protected readonly activeSlide = signal(0);
  private carouselIntervalId: any = null;

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
  protected readonly displayCurrency = signal<'USD' | 'BOB'>('BOB');

  // Pagination States
  protected readonly currentPage = signal<number>(1);
  protected readonly pageSize = 6;

  // UI state
  protected readonly isMobileFiltersOpen = signal(false);

  protected readonly isCategoryLocked = signal<boolean>(false);
  protected readonly catalogTitle = signal<string>('Catálogo de Vehículos');

  constructor() {
    // Reset active slide when category changes
    effect(() => {
      this.filterCategory();
      this.activeSlide.set(0);
    });
  }

  public ngOnInit(): void {
    // Escuchar data de la ruta para ver si es un catálogo dedicado
    this.route.data.subscribe(data => {
      if (data['category']) {
        this.filterCategory.set(data['category']);
        this.isCategoryLocked.set(true);
      } else {
        this.isCategoryLocked.set(false);
      }
      if (data['title']) {
        this.catalogTitle.set(data['title']);
      } else {
        this.catalogTitle.set('Catálogo de Vehículos');
      }
    });

    // Escuchar parámetros de ruta (ej. buscador en Home o click en categorías)
    this.route.queryParams.subscribe(params => {
      if (!this.isCategoryLocked() && params['categoria']) {
        this.filterCategory.set(params['categoria']);
      }
      if (params['buscar']) {
        this.filterText.set(params['buscar']);
      }
      this.resetPagination();
    });

    this.startCarousel();
  }

  public ngOnDestroy(): void {
    this.stopCarousel();
  }

  private startCarousel(): void {
    if (typeof window !== 'undefined') {
      this.carouselIntervalId = setInterval(() => {
        this.nextSlide();
      }, 7000);
    }
  }

  private stopCarousel(): void {
    if (this.carouselIntervalId) {
      clearInterval(this.carouselIntervalId);
    }
  }

  protected setSlide(index: number): void {
    this.activeSlide.set(index);
    this.stopCarousel();
    this.startCarousel();
  }

  protected prevSlide(): void {
    const current = this.activeSlide();
    const count = this.recommendedCategoryVehicles().length;
    if (count === 0) return;
    const prev = current === 0 ? count - 1 : current - 1;
    this.activeSlide.set(prev);
    this.stopCarousel();
    this.startCarousel();
  }

  protected nextSlide(): void {
    const current = this.activeSlide();
    const count = this.recommendedCategoryVehicles().length;
    if (count === 0) return;
    const next = current === count - 1 ? 0 : current + 1;
    this.activeSlide.set(next);
    this.stopCarousel();
    this.startCarousel();
  }

  // Dynamic brand selection based on current category
  protected readonly uniqueBrands = computed(() => {
    const cat = this.filterCategory();
    const list = this.vehicleService.vehicles();
    const filteredByCat = cat ? list.filter(v => v.categoria === cat) : list;
    return Array.from(new Set(filteredByCat.map(v => v.marca))).sort();
  });

  protected readonly recommendedCategoryVehicles = computed(() => {
    const category = this.filterCategory();
    if (!category) return [];

    const list = this.vehicleService.vehicles()
      .filter(v => v.categoria === category && v.estado === 'disponible');

    const featured = list.filter(v => v.destacado);
    const standard = list.filter(v => !v.destacado);

    return [...featured, ...standard].slice(0, 4);
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
    const targetCurr = this.displayCurrency();
    if (this.filterMinPrice() !== null) {
      result = result.filter(v => this.getVehicleDisplayedPrice(v, targetCurr) >= this.filterMinPrice()!);
    }
    if (this.filterMaxPrice() !== null) {
      result = result.filter(v => this.getVehicleDisplayedPrice(v, targetCurr) <= this.filterMaxPrice()!);
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
      result.sort((a, b) => this.getVehicleDisplayedPrice(a, targetCurr) - this.getVehicleDisplayedPrice(b, targetCurr));
    } else if (this.sortBy() === 'precio_desc') {
      result.sort((a, b) => this.getVehicleDisplayedPrice(b, targetCurr) - this.getVehicleDisplayedPrice(a, targetCurr));
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
    const hasCategoryFilter = !this.isCategoryLocked() && this.filterCategory() !== '';
    return hasCategoryFilter ||
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
    if (!this.isCategoryLocked()) {
      this.filterCategory.set('');
      this.router.navigate([], { queryParams: {} });
    } else {
      this.router.navigate([], { queryParams: { buscar: null, condicion: null } });
    }
    this.filterText.set('');
    this.filterBrand.set('');
    this.filterMinPrice.set(null);
    this.filterMaxPrice.set(null);
    this.filterCondition.set('');
    this.filterTransmission.set('');
    this.filterFuel.set('');
    this.sortBy.set('reciente');

    this.resetPagination();
  }

  protected resetPagination(): void {
    this.currentPage.set(1);
  }

  protected setDisplayCurrency(curr: 'USD' | 'BOB'): void {
    this.displayCurrency.set(curr);
    this.resetPagination();
  }

  protected getVehicleDisplayedPrice(v: Vehicle, targetCurrency: 'USD' | 'BOB'): number {
    const source = v.moneda || 'USD';
    const price = v.precio;
    const rate = 6.96;

    if (source === targetCurrency) {
      return price;
    }
    if (source === 'USD' && targetCurrency === 'BOB') {
      return price * rate;
    }
    if (source === 'BOB' && targetCurrency === 'USD') {
      return price / rate;
    }
    return price;
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
