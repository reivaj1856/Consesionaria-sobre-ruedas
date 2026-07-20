import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-users-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600">Administración</span>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 mt-1">Gestión de Usuarios y Planes</h1>
          <p class="text-xs text-slate-500 mt-1">Activa o modifica los planes de suscripción (Gratis, Negocio, Empresa) solicitados por los clientes.</p>
        </div>
        <div>
          <a routerLink="/admin" class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Volver al Panel
          </a>
        </div>
      </div>

      <!-- Controls -->
      <div class="mt-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="relative w-full sm:max-w-xs">
          <input type="text" [(ngModel)]="searchQuery" placeholder="Buscar por nombre o email..."
                 class="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none shadow-sm" />
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-3 h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div class="text-xs text-slate-500 font-medium">
          Mostrando {{ filteredUsers().length }} usuarios registrados
        </div>
      </div>

      <!-- Users Table -->
      <div class="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        @if (loading()) {
          <div class="py-12 flex justify-center">
            <span class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
          </div>
        } @else {
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-100">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Correo Electrónico</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Plan Activo</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fecha de Asignación</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Cambiar Plan</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (u of filteredUsers(); track u.id) {
                  <tr class="hover:bg-slate-50/30 transition-colors">
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm font-bold text-slate-900">{{ u.nombre }}</div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm text-slate-600">
                      {{ u.email }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-xs font-semibold">
                      <span class="inline-flex items-center rounded-md px-2 py-0.5"
                            [class]="u.rol === 'admin' ? 'bg-purple-50 text-purple-700 ring-1 ring-inset ring-purple-700/10' : 'bg-slate-50 text-slate-700 ring-1 ring-inset ring-slate-700/10'">
                        {{ u.rol }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <span class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold capitalize"
                            [class]="getPlanBadgeClass(u.plan || 'gratis')">
                        {{ u.plan || 'gratis' }}
                      </span>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                      {{ u.suscripcionFecha || 'No disponible' }}
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-sm">
                      @if (u.rol === 'admin') {
                        <span class="text-xs text-slate-400 italic">No aplicable a Admin</span>
                      } @else {
                        <div class="flex items-center gap-2">
                          <select [value]="u.plan || 'gratis'" 
                                  (change)="onPlanChange(u.id, $event)"
                                  [disabled]="updatingUserId() === u.id"
                                  class="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none">
                            <option value="gratis">Gratis ($0)</option>
                            <option value="negocio">Negocio ($19)</option>
                            <option value="empresa">Empresa ($49)</option>
                          </select>
                          @if (updatingUserId() === u.id) {
                            <span class="animate-spin h-3.5 w-3.5 border-2 border-blue-600 border-t-transparent rounded-full"></span>
                          }
                        </div>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="6" class="px-6 py-12 text-center text-sm text-slate-500">
                      No se encontraron usuarios que coincidan con la búsqueda.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>

    </div>
  `
})
export class UsersAdminComponent implements OnInit {
  private readonly authService = inject(AuthService);

  protected readonly usersList = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly updatingUserId = signal<string | null>(null);

  protected searchQuery = '';

  protected readonly filteredUsers = computed(() => {
    const list = this.usersList();
    const query = this.searchQuery.toLowerCase().trim();
    if (!query) return list;
    return list.filter(u => 
      u.nombre.toLowerCase().includes(query) || 
      u.email.toLowerCase().includes(query)
    );
  });

  public ngOnInit(): void {
    this.fetchUsers();
  }

  private async fetchUsers(): Promise<void> {
    this.loading.set(true);
    const data = await this.authService.getUsers();
    this.usersList.set(data);
    this.loading.set(false);
  }

  protected getPlanBadgeClass(plan: string): string {
    switch (plan) {
      case 'negocio':
        return 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-700/10';
      case 'empresa':
        return 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/10';
      default:
        return 'bg-slate-50 text-slate-600 ring-1 ring-inset ring-slate-500/10';
    }
  }

  protected async onPlanChange(userId: string, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const newPlan = select.value as 'gratis' | 'negocio' | 'empresa';

    this.updatingUserId.set(userId);
    const success = await this.authService.updateUserPlan(userId, newPlan);
    this.updatingUserId.set(null);

    if (success) {
      // Recargar usuarios
      await this.fetchUsers();
    } else {
      alert('Hubo un error al actualizar el plan de suscripción del usuario.');
      // Revertir el valor en la UI volviendo a cargar
      await this.fetchUsers();
    }
  }
}
