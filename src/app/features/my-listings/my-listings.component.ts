import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { VehicleService } from '../../core/services/vehicle.service';
import { AuthService } from '../../core/services/auth.service';
import { Vehicle, getCategoryLabel } from '../../core/models/vehicle.model';

@Component({
  selector: 'app-my-listings',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Upper Section: Profile & Plan Info -->
      <div class="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-wider text-blue-600">Mi Cuenta</span>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 mt-1">Mis Publicaciones</h1>
          
          <div class="mt-4 flex flex-wrap gap-3 items-center">
            <span class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 capitalize ring-1 ring-inset ring-blue-700/10">
              Plan: {{ currentPlan() }}
            </span>
            <span class="text-xs text-slate-500 font-medium">
              Publicado: {{ listingsCount() }} de {{ planLimit() }} cuotas activas
            </span>
          </div>
        </div>

        <div class="flex gap-2">
          <a routerLink="/planes" 
             class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition-colors">
            Cambiar Plan
          </a>
          
          @if (listingsCount() < planLimit()) {
            <a routerLink="/admin/crear" 
               class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="mr-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Publicar Vehículo
            </a>
          } @else {
            <button disabled 
                    title="Límite alcanzado, por favor mejora tu plan de suscripción."
                    class="inline-flex items-center justify-center rounded-xl bg-slate-300 px-5 py-3 text-xs font-bold text-slate-500 cursor-not-allowed">
              Límite Alcanzado
            </button>
          }
        </div>
      </div>

      <!-- Listings Stock list -->
      <div class="mt-8">
        <h2 class="text-lg font-bold text-slate-900 mb-4">Mis Vehículos en Stock</h2>

        @if (loading()) {
          <div class="py-12 flex justify-center">
            <span class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
          </div>
        } @else {
          
          <div class="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-slate-100">
                <thead class="bg-slate-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Vehículo</th>
                    <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                    <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Precio (USD)</th>
                    <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Condición</th>
                    <th scope="col" class="px-6 py-3 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                
                <tbody class="divide-y divide-slate-100">
                  @for (v of myListings(); track v.id) {
                    <tr class="hover:bg-slate-50/50 transition-colors">
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
                      
                      <td class="whitespace-nowrap px-6 py-4 text-xs text-slate-650">
                        {{ getCategoryLabel(v.categoria) }}
                      </td>
                      
                      <td class="whitespace-nowrap px-6 py-4 text-sm font-bold text-slate-900">
                        {{ v.precio | currency:(v.moneda || 'USD'):((v.moneda || 'USD') === 'BOB' ? 'Bs. ' : '$'):'1.0-0' }}
                      </td>
                      
                      <td class="whitespace-nowrap px-6 py-4 text-xs capitalize font-semibold text-slate-700">
                        {{ v.condicion }}
                      </td>

                      <td class="whitespace-nowrap px-6 py-4">
                        <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                              [class]="v.estado === 'disponible' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/10' : 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10'">
                          {{ v.estado }}
                        </span>
                      </td>

                      <td class="whitespace-nowrap px-6 py-4 text-right text-xs font-medium space-x-2">
                        <a [routerLink]="['/admin/editar', v.id]" class="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white shadow-sm transition-colors">
                          Editar
                        </a>
                        <button (click)="deleteItem(v.id)" class="inline-flex rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 dark:hover:border-red-900/50 shadow-sm transition-colors">
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td colspan="6" class="px-6 py-12 text-center">
                        <div class="max-w-md mx-auto">
                          <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V4a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                          </svg>
                          <h3 class="mt-4 text-sm font-bold text-slate-900">No tienes vehículos publicados</h3>
                          <p class="mt-1 text-xs text-slate-500">Comienza publicando tu primer vehículo para que otros usuarios puedan verlo y reservarlo.</p>
                          <div class="mt-6">
                            <a routerLink="/admin/crear" class="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-500 transition-colors">
                              Publicar Vehículo
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
          
        }
      </div>

    </div>
  `
})
export class MyListingsComponent implements OnInit {
  private readonly vehicleService = inject(VehicleService);
  private readonly authService = inject(AuthService);
  protected readonly getCategoryLabel = getCategoryLabel;

  protected readonly myListings = signal<Vehicle[]>([]);
  protected readonly loading = signal(true);

  protected readonly currentPlan = computed(() => {
    const user = this.authService.currentUser();
    return user ? user.plan || 'gratis' : 'gratis';
  });

  protected readonly listingsCount = computed(() => this.myListings().length);

  protected readonly planLimit = computed(() => {
    const plan = this.currentPlan();
    if (plan === 'negocio') return 60;
    if (plan === 'empresa') return 300;
    return 2;
  });

  public ngOnInit(): void {
    this.fetchListings();
  }

  private async fetchListings(): Promise<void> {
    this.loading.set(true);
    const data = await this.vehicleService.getMyListings();
    this.myListings.set(data);
    this.loading.set(false);
  }

  protected async deleteItem(id: string): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación permanentemente?')) {
      await this.vehicleService.deleteVehicle(id);
      await this.fetchListings();
    }
  }
}
