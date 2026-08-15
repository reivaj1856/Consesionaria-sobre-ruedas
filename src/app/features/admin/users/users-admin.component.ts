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
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 mt-1">Gestión de Usuarios y Roles</h1>
          <p class="text-xs text-slate-500 mt-1">Administra los roles de usuarios, asigna agentes a concesionarias y edita sus saldos de beneficios.</p>
        </div>
        <div>
          <a routerLink="/admin" class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Volver al Panel
          </a>
        </div>
      </div>

      <!-- Configuration Widget -->
      <div class="mt-6 bg-slate-50 border border-slate-200/85 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between">
        <div>
          <h2 class="text-base font-bold text-slate-900">Beneficio de Venta para Agentes</h2>
          <p class="text-xs text-slate-500 mt-1">Define el monto en USD que reciben los agentes automáticamente al marcar un vehículo como vendido.</p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <div class="relative">
            <span class="absolute left-3.5 top-2.5 text-sm font-semibold text-slate-400">$</span>
            <input type="number" #benefitInput [value]="benefitSetting()" 
                   class="w-32 rounded-xl border border-slate-200 bg-white px-3.5 pl-7 py-2.5 text-sm font-bold text-slate-800 focus:border-blue-500 focus:outline-none shadow-sm" />
          </div>
          <button (click)="onUpdateBenefitSetting(benefitInput.value)" [disabled]="updatingSetting()"
                  class="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center gap-1.5">
            @if (updatingSetting()) {
              <span class="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full"></span>
            } @else {
              Guardar Configuración
            }
          </button>
        </div>
      </div>

      <!-- Controls -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
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
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre / Email</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rol de Cuenta</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Concesionaria Asociada</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Beneficios Acumulados</th>
                  <th scope="col" class="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado / Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100">
                @for (u of filteredUsers(); track u.id) {
                  <tr class="hover:bg-slate-50/30 transition-colors">
                    <td class="whitespace-nowrap px-6 py-4">
                      <div class="text-sm font-bold text-slate-900">{{ u.nombre }}</div>
                      <div class="text-xs text-slate-500 mt-0.5">{{ u.email }}</div>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      <select [value]="u.rol" 
                              (change)="onRoleChange(u, $event)"
                              [disabled]="updatingUserId() === u.id"
                              class="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none">
                        <option value="administrador">Administrador</option>
                        <option value="concesionaria">Concesionaria</option>
                        <option value="agente">Agente</option>
                      </select>
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      @if (u.rol === 'agente') {
                        <select [value]="u.concesionariaId || ''" 
                                (change)="onConcesionariaChange(u, $event)"
                                [disabled]="updatingUserId() === u.id"
                                class="rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none max-w-[200px]">
                          <option value="">(Sin asignar)</option>
                          @for (c of concesionariasList(); track c.id) {
                            <option [value]="c.id">{{ c.nombre }}</option>
                          }
                        </select>
                      } @else {
                        <span class="text-xs text-slate-400 italic">No aplica</span>
                      }
                    </td>
                    <td class="whitespace-nowrap px-6 py-4">
                      @if (u.rol === 'agente') {
                        <div class="flex items-center gap-1.5">
                          <span class="text-xs font-bold text-slate-400">$</span>
                          <input type="number" #benefitsVal [value]="u.beneficios || 0"
                                 (change)="onBenefitsChange(u, benefitsVal.value)"
                                 [disabled]="updatingUserId() === u.id"
                                 class="w-24 rounded-lg border border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700 focus:border-blue-500 focus:outline-none" />
                        </div>
                      } @else {
                        <span class="text-xs text-slate-400 italic">No aplica</span>
                      }
                    </td>
                    <td class="whitespace-nowrap px-6 py-4 text-xs">
                      @if (updatingUserId() === u.id) {
                        <span class="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full inline-block"></span>
                      } @else {
                        <span class="text-emerald-600 font-bold flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                          Guardado
                        </span>
                      }
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-sm text-slate-500">
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
  protected readonly concesionariasList = signal<User[]>([]);
  protected readonly loading = signal(true);
  protected readonly updatingUserId = signal<string | null>(null);
  protected readonly benefitSetting = signal<number>(100);
  protected readonly updatingSetting = signal(false);

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
    this.fetchConcesionarias();
    this.fetchBenefitSetting();
  }

  private async fetchUsers(): Promise<void> {
    this.loading.set(true);
    const data = await this.authService.getUsers();
    this.usersList.set(data);
    this.loading.set(false);
  }

  private async fetchConcesionarias(): Promise<void> {
    const list = await this.authService.getConcesionarias();
    this.concesionariasList.set(list);
  }

  private async fetchBenefitSetting(): Promise<void> {
    const val = await this.authService.getBeneficioSetting();
    this.benefitSetting.set(val);
  }

  protected async onUpdateBenefitSetting(val: string): Promise<void> {
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) {
      alert('Por favor ingrese un valor de beneficio válido.');
      return;
    }
    this.updatingSetting.set(true);
    const success = await this.authService.updateBeneficioSetting(num);
    this.updatingSetting.set(false);
    if (success) {
      this.benefitSetting.set(num);
      alert('Monto de beneficio de venta actualizado exitosamente.');
    } else {
      alert('Hubo un error al actualizar la configuración del beneficio.');
    }
  }

  private async updateUser(userId: string, updateData: any): Promise<void> {
    this.updatingUserId.set(userId);
    const success = await this.authService.adminUpdateUser(userId, updateData);
    this.updatingUserId.set(null);

    if (success) {
      await this.fetchUsers();
      await this.fetchConcesionarias();
    } else {
      alert('Hubo un error al actualizar la información del usuario.');
      await this.fetchUsers();
    }
  }

  protected async onRoleChange(user: User, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const newRole = select.value as 'administrador' | 'concesionaria' | 'agente';
    await this.updateUser(user.id, { rol: newRole });
  }

  protected async onConcesionariaChange(user: User, event: Event): Promise<void> {
    const select = event.target as HTMLSelectElement;
    const concesionariaId = select.value;
    await this.updateUser(user.id, { concesionariaId: concesionariaId || null });
  }

  protected async onBenefitsChange(user: User, value: string): Promise<void> {
    const amount = parseFloat(value);
    if (isNaN(amount) || amount < 0) {
      alert('Por favor ingrese un monto de beneficios válido.');
      return;
    }
    await this.updateUser(user.id, { beneficios: amount });
  }
}
