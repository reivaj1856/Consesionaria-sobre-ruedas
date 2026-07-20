import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { SpecificationService } from '../../../core/services/specification.service';
import { SpecificationGroup, Specification } from '../../../core/models/vehicle.model';

@Component({
  selector: 'app-specifications-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900">Gestión de Características</h1>
          <p class="mt-2 text-sm text-slate-500">Crea y categoriza características y equipamientos para el catálogo de vehículos</p>
        </div>
        <a routerLink="/admin" class="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3.5 py-2 border border-slate-200 rounded-lg shadow-sm">
          Regresar al Panel
        </a>
      </div>

      <div class="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Formulario: Crear Grupo / Especificación -->
        <div class="space-y-6">
          
          <!-- Crear Grupo -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 class="text-base font-bold text-slate-900">Crear Categoría / Grupo</h2>
            <p class="text-xs text-slate-400 mt-1">Ej. Seguridad, Confort, Multimedia, etc.</p>
            
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase font-bold">Nombre del Grupo</label>
                <input type="text" [(ngModel)]="groupName" placeholder="Ej. Exterior"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              
              @if (groupError()) {
                <p class="text-xs text-rose-500">{{ groupError() }}</p>
              }
              @if (groupSuccess()) {
                <p class="text-xs text-emerald-600">{{ groupSuccess() }}</p>
              }

              <button (click)="createGroup()" [disabled]="!groupName().trim()"
                      class="w-full rounded-lg bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition-colors disabled:opacity-50">
                Crear Grupo
              </button>
            </div>
          </div>

          <!-- Crear Especificación -->
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 class="text-base font-bold text-slate-900">Crear Característica</h2>
            <p class="text-xs text-slate-400 mt-1">Agrega una característica individual a un grupo.</p>
            
            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase font-bold">Nombre</label>
                <input type="text" [(ngModel)]="specName" placeholder="Ej. Cámara 360, Techo solar"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase font-bold">Grupo / Categoría</label>
                <select [(ngModel)]="specGroupId"
                        class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  @for (group of groups(); track group.id) {
                    <option [value]="group.id">{{ group.nombre }}</option>
                  }
                </select>
              </div>

              @if (specError()) {
                <p class="text-xs text-rose-500">{{ specError() }}</p>
              }
              @if (specSuccess()) {
                <p class="text-xs text-emerald-600">{{ specSuccess() }}</p>
              }

              <button (click)="createSpec()" [disabled]="!specName().trim() || !specGroupId()"
                      class="w-full rounded-lg bg-blue-600 hover:bg-blue-500 text-white py-2.5 text-xs font-bold transition-colors disabled:opacity-50">
                Crear Característica
              </button>
            </div>
          </div>

        </div>

        <!-- Listado de Especificaciones Agrupadas -->
        <div class="lg:col-span-2 space-y-6">
          
          <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 class="text-lg font-bold text-slate-900 mb-4">Estructura de Características</h2>
            
            <div class="space-y-6">
              @for (group of groups(); track group.id) {
                <div class="border-b border-slate-100 pb-5 last:border-b-0 last:pb-0">
                  <div class="flex items-center justify-between mb-3">
                    <h3 class="text-sm font-extrabold text-slate-800 uppercase tracking-wider">{{ group.nombre }}</h3>
                    <span class="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">
                      {{ group.especificaciones?.length || 0 }} características
                    </span>
                  </div>
                  
                  <div class="flex flex-wrap gap-2">
                    @for (spec of group.especificaciones; track spec.id) {
                      <span class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50/50 px-2.5 py-1.5 text-xs font-medium text-slate-700">
                        <span class="h-1.5 w-1.5 rounded-full bg-blue-500"></span>
                        {{ spec.nombre }}
                      </span>
                    } @empty {
                      <span class="text-xs text-slate-400 italic">No hay características registradas en este grupo.</span>
                    }
                  </div>
                </div>
              } @empty {
                <div class="text-center py-12">
                  <p class="text-sm text-slate-400">No se encontraron categorías de especificaciones registradas.</p>
                </div>
              }
            </div>

          </div>

        </div>

      </div>

    </div>
  `
})
export class SpecificationsAdminComponent implements OnInit {
  private readonly specService = inject(SpecificationService);

  protected readonly groups = signal<SpecificationGroup[]>([]);

  // Inputs de grupo
  protected readonly groupName = signal('');
  protected readonly groupError = signal('');
  protected readonly groupSuccess = signal('');

  // Inputs de especificación
  protected readonly specName = signal('');
  protected readonly specGroupId = signal<number>(0);
  protected readonly specError = signal('');
  protected readonly specSuccess = signal('');

  public ngOnInit(): void {
    this.loadData();
  }

  private async loadData(): Promise<void> {
    const data = await this.specService.getGroups();
    this.groups.set(data);
    if (data.length > 0 && !this.specGroupId()) {
      this.specGroupId.set(data[0].id);
    }
  }

  protected async createGroup(): Promise<void> {
    const name = this.groupName().trim();
    if (!name) return;

    this.groupError.set('');
    this.groupSuccess.set('');

    const res = await this.specService.createGroup(name);
    if (res) {
      this.groupSuccess.set(`Grupo "${name}" creado exitosamente.`);
      this.groupName.set('');
      await this.loadData();
    } else {
      this.groupError.set(`El grupo "${name}" ya existe o hubo un error.`);
    }
  }

  protected async createSpec(): Promise<void> {
    const name = this.specName().trim();
    const groupId = Number(this.specGroupId());
    if (!name || !groupId) return;

    this.specError.set('');
    this.specSuccess.set('');

    const res = await this.specService.createSpecification(name, groupId);
    if (res) {
      this.specSuccess.set(`Característica "${name}" creada exitosamente.`);
      this.specName.set('');
      await this.loadData();
    } else {
      this.specError.set(`La característica "${name}" ya existe o hubo un error.`);
    }
  }
}
