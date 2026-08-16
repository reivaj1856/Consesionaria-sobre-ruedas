import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VehicleService } from '../../../core/services/vehicle.service';
import { SpecificationService } from '../../../core/services/specification.service';
import { AuthService } from '../../../core/services/auth.service';
import { Vehicle, SpecificationGroup, Specification } from '../../../core/models/vehicle.model';
import { compressImage } from '../../../core/utils/image-compressor.util';

interface HotspotConfig {
  id: number;
  top: string;
  left: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-admin-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="border-b border-slate-200 pb-5 flex justify-between items-center">
        <div>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900">
            {{ isEditMode() ? 'Editar Vehículo' : 'Registrar Nuevo Vehículo' }}
          </h1>
          <p class="mt-2 text-sm text-slate-500">Completa la ficha comercial y técnica del vehículo en el inventario</p>
        </div>
        <a routerLink="/admin" class="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3.5 py-2 border border-slate-200 rounded-lg shadow-sm">
          Regresar
        </a>
      </div>      <!-- Alert Banner -->
      @if (alertMessage()) {
        <div class="mt-6 rounded-2xl p-5 border shadow-lg transition-all"
             [class.bg-rose-50]="alertMessage()?.type === 'error'"
             [class.border-rose-200]="alertMessage()?.type === 'error'"
             [class.bg-emerald-50]="alertMessage()?.type === 'success'"
             [class.border-emerald-200]="alertMessage()?.type === 'success'">
          <div class="flex items-start gap-3">
            @if (alertMessage()?.type === 'error') {
              <div class="p-2 bg-rose-100 text-rose-600 rounded-xl shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            } @else {
              <div class="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            }
            <div>
              <h3 class="font-heading text-base font-bold"
                  [class.text-rose-900]="alertMessage()?.type === 'error'"
                  [class.text-emerald-900]="alertMessage()?.type === 'success'">
                {{ alertMessage()?.title }}
              </h3>
              @if (alertMessage()?.details && alertMessage()!.details!.length > 0) {
                <ul class="mt-2 space-y-1 text-xs font-semibold text-rose-700 list-disc list-inside">
                  @for (detail of alertMessage()!.details; track detail) {
                    <li>{{ detail }}</li>
                  }
                </ul>
              }
            </div>
          </div>
        </div>
      }

      <!-- Form Card -->
      <div class="mt-8 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        
        <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="space-y-6">
          
          <!-- Seccion 1: Datos Básicos -->
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Información Básica</h2>
            
            <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Nombre Comercial</label>
                <input type="text" formControlName="nombre" placeholder="Ej. Ford Mustang GT Premium"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                       [class.border-red-400]="isFieldInvalid('nombre')" />
              </div>

              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase font-bold">Categoría</label>
                <select formControlName="categoria" (change)="onCategoryChange()"
                        class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="autos">Autos</option>
                  <option value="autos_electricos">Autos Eléctricos</option>
                  <option value="motos">Motos</option>
                  <option value="motos_electricos">Motos Eléctricas</option>
                  <option value="maquinaria_agricola">Maquinaria Agrícola</option>
                  <option value="transporte_pesado">Transporte Pesado</option>
                </select>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Marca</label>
                <input type="text" formControlName="marca" placeholder="Ej. Ford"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                       [class.border-red-400]="isFieldInvalid('marca')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase font-bold">Modelo</label>
                <input type="text" formControlName="modelo" placeholder="Ej. Mustang"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                       [class.border-red-400]="isFieldInvalid('modelo')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase font-bold">Año</label>
                <input type="number" formControlName="anio" placeholder="2024"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                       [class.border-red-400]="isFieldInvalid('anio')" />
              </div>
              <div>
                <div class="grid grid-cols-3 gap-1">
                  <div class="col-span-2">
                    <label class="block text-[10px] font-semibold text-slate-500 uppercase font-bold tracking-tight">Precio</label>
                    <input type="number" formControlName="precio" placeholder="45000"
                           class="mt-1.5 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm focus:border-blue-500 focus:outline-none"
                           [class.border-red-400]="isFieldInvalid('precio')" />
                  </div>
                  <div>
                    <label class="block text-[10px] font-semibold text-slate-500 uppercase font-bold tracking-tight">Moneda</label>
                    <select formControlName="moneda"
                            class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-1 py-2 text-sm focus:border-blue-500 focus:outline-none">
                      <option value="USD">USD</option>
                      <option value="BOB">BOB</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Seccion 2: Características del Vehículo -->
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Características Técnicas Generales</h2>
            
            <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Kilometraje (Km)</label>
                <input type="number" formControlName="kilometraje" placeholder="0"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                       [class.border-red-400]="isFieldInvalid('kilometraje')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Condición</label>
                <select formControlName="condicion" 
                        class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="nuevo">Nuevo</option>
                  <option value="usado">Usado</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Transmisión</label>
                <select formControlName="transmision" 
                        class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="Manual">Manual</option>
                  <option value="Automática">Automática</option>
                  <option value="Hidrostática">Hidrostática</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Combustible</label>
                <select formControlName="tipoCombustible" 
                        class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="Gasolina">Gasolina</option>
                  <option value="Diésel">Diésel</option>
                  <option value="Híbrido">Híbrido</option>
                  <option value="Eléctrico">Eléctrico</option>
                </select>
              </div>
            </div>

            <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Ubicación física</label>
                <input type="text" formControlName="ubicacion" placeholder="Ej. Santiago, Centro"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                       [class.border-red-400]="isFieldInvalid('ubicacion')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase font-bold">Teléfono de Contacto</label>
                <input type="text" formControlName="telefonoContacto" placeholder="Ej. 59177490451"
                       class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                       [class.border-red-400]="isFieldInvalid('telefonoContacto')" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-500 uppercase">Estado Comercial</label>
                <select formControlName="estado" 
                        class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  <option value="disponible">Disponible</option>
                  <option value="reservado">Reservado</option>
                  <option value="vendido">Vendido</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Seccion 3: Imágenes (Subida de Archivos) -->
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Visuales (Carga de Imágenes)</h2>
            
            <div class="mt-4 space-y-6">
              <!-- Imagen Principal -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Imagen Principal del Vehículo</label>
                
                @if (imagenPrincipalPreview()) {
                  <div class="mt-2 h-52 w-full rounded-2xl overflow-hidden relative border border-slate-200 bg-slate-900 shadow-sm">
                    <img [src]="imagenPrincipalPreview()" class="h-full w-full object-cover" />
                    <button type="button" (click)="removeImagenPrincipal()" 
                            class="absolute top-3 right-3 bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow transition-colors flex items-center gap-1 focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Cambiar Imagen Principal
                    </button>
                  </div>
                } @else {
                  <div class="mt-2 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-slate-50/50">
                    <input type="file" (change)="onMainFileSelected($event)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer" />
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-10 w-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs text-slate-600 block mt-2 font-bold">Haz clic o arrastra un archivo de imagen aquí</span>
                    <span class="text-[10px] text-slate-400 block mt-1">Soporta JPG, PNG, WEBP. Se guardará directamente en la base de datos.</span>
                  </div>
                }
              </div>

              <!-- Galería de Imágenes Adicionales -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Galería de Imágenes Adicionales</label>
                
                <div class="mt-2 border-2 border-dashed border-slate-200 rounded-2xl p-5 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-slate-50/50">
                  <input type="file" (change)="onGalleryFilesSelected($event)" accept="image/*" multiple class="absolute inset-0 opacity-0 cursor-pointer" />
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-xs text-slate-600 block mt-1 font-bold font-sans">Añadir fotos a la galería (puedes seleccionar múltiples archivos)</span>
                </div>

                @if (galleryImages().length > 0) {
                  <div class="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @for (img of galleryImages(); track $index) {
                      <div class="relative aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 group shadow-sm">
                        <img [src]="img" class="h-full w-full object-cover" />
                        <button type="button" (click)="removeGalleryImage($index)" 
                                class="absolute top-1.5 right-1.5 bg-red-600 hover:bg-red-500 text-white rounded-full p-1 shadow transition-colors focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>
          </div>



          <!-- Seccion 4: Especificaciones de Subtipo (Ficha Técnica Específica) -->
          <div>
            <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">Especificaciones de Categoría</h2>
            
            @if (vehicleForm.get('categoria')?.value === 'autos' || vehicleForm.get('categoria')?.value === 'autos_electricos') {
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase">Carrocería</label>
                  <input type="text" formControlName="autoCarroceria" placeholder="Ej. Sedán, SUV, Pickup" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase">Número de Puertas</label>
                  <input type="number" formControlName="autoPuertas" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase">Pasajeros</label>
                  <input type="number" formControlName="autoPasajeros" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              @if (vehicleForm.get('categoria')?.value === 'autos_electricos') {
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase font-bold">Autonomía (km)</label>
                    <input type="number" formControlName="autoAutonomia" placeholder="Ej. 629" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase font-bold">Tamaño de Batería (kWh)</label>
                    <input type="number" formControlName="autoTamanoBateria" placeholder="Ej. 75" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              }
            }

            @if (vehicleForm.get('categoria')?.value === 'motos' || vehicleForm.get('categoria')?.value === 'motos_electricos') {
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase">Cilindrada (cc)</label>
                  <input type="number" formControlName="motoCilindrada" placeholder="Ej. 500" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase">Tipo de Motocicleta</label>
                  <input type="text" formControlName="motoTipoMoto" placeholder="Ej. Naked, Scooter, Custom" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
              @if (vehicleForm.get('categoria')?.value === 'motos_electricos') {
                <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase font-bold">Autonomía (km)</label>
                    <input type="number" formControlName="motoAutonomia" placeholder="Ej. 235" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase font-bold">Tamaño de Batería (kWh)</label>
                    <input type="number" formControlName="motoTamanoBateria" placeholder="Ej. 15" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                  </div>
                </div>
              }
            }

            @if (vehicleForm.get('categoria')?.value === 'maquinaria' || vehicleForm.get('categoria')?.value === 'maquinaria_agricola' || vehicleForm.get('categoria')?.value === 'transporte_pesado') {
              <div class="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase">Peso Operativo (kg)</label>
                  <input type="number" formControlName="maquinariaPesoOperativo" placeholder="Ej. 20500" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-500 uppercase">Horas de Uso</label>
                  <input type="number" formControlName="maquinariaHorasUso" placeholder="Ej. 2400" class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                </div>
              </div>
            }
          </div>

          <!-- Seccion 5: Equipamiento y Características -->
          <div class="mt-6">
            <div class="flex justify-between items-center border-b border-slate-100 pb-2">
              <h2 class="text-sm font-bold text-slate-900 uppercase tracking-wider">Equipamiento y Características</h2>
              <button type="button" (click)="openAddSpecModal()" class="text-xs font-semibold text-blue-600 hover:text-blue-500 flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar Nueva Característica
              </button>
            </div>
            
            <div class="mt-4 space-y-5">
              @for (group of specificationGroups(); track group.id) {
                <div>
                  <h3 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">{{ group.nombre }}</h3>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-200/50">
                    @for (spec of group.especificaciones; track spec.id) {
                      <label class="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                        <input type="checkbox"
                               [checked]="selectedSpecs().includes(spec.id)"
                               (change)="toggleSpec(spec.id)"
                               class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded border-slate-200" />
                        <span class="truncate">{{ spec.nombre }}</span>
                      </label>
                    }
                  </div>
                </div>
              }
            </div>
          </div>

          <!-- Seccion 6: Descripción y Destacado -->
          <div class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-slate-500 uppercase">Descripción Comercial</label>
              <textarea formControlName="descripcion" rows="4" placeholder="Escribe los argumentos de ventas..."
                        class="mt-1.5 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                        [class.border-red-400]="isFieldInvalid('descripcion')"></textarea>
            </div>

            <div class="flex items-center gap-2 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              <input type="checkbox" formControlName="destacado" id="destacado" class="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded" />
              <label for="destacado" class="text-xs font-bold text-slate-700 cursor-pointer select-none">Marcar este vehículo como DESTACADO (se mostrará en el Home)</label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-4 border-t border-slate-100 flex gap-4">
            <button type="submit" [disabled]="isSubmitting()"
                    class="w-full sm:w-auto rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              @if (isSubmitting()) {
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Guardando...</span>
              } @else {
                <span>{{ isEditMode() ? 'Guardar Cambios' : 'Registrar Vehículo' }}</span>
              }
            </button>
            <a routerLink="/admin" class="w-full sm:w-auto text-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors">
              Cancelar
            </a>
          </div>

        </form>

      </div>
      
      <!-- MODAL: Agregar Especificación -->
      @if (isAddSpecModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-black/50 flex items-center justify-center p-4">
          <div class="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl relative">
            <button type="button" (click)="closeAddSpecModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="font-heading text-xl font-bold text-slate-900">Nueva Característica</h3>
            <p class="text-xs text-slate-500 mt-1">Crea una especificación disponible para todo el inventario.</p>

            <div class="mt-4 space-y-4">
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase">Nombre</label>
                <input type="text" [(ngModel)]="newSpecName" placeholder="Ej. Techo Solar, ABS"
                       class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 uppercase font-bold">Grupo / Categoría</label>
                <select [(ngModel)]="newSpecGroupId"
                        class="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                  @for (group of specificationGroups(); track group.id) {
                    <option [value]="group.id">{{ group.nombre }}</option>
                  }
                </select>
              </div>
              
              @if (newSpecError()) {
                <p class="text-xs text-rose-500">{{ newSpecError() }}</p>
              }

              <button type="button" (click)="submitNewSpec()" [disabled]="!newSpecName().trim() || !newSpecGroupId()"
                      class="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
                Guardar Especificación
              </button>
            </div>
          </div>
        </div>
      }
      
    </div>
  `
})
export class AdminFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly vehicleService = inject(VehicleService);
  private readonly specService = inject(SpecificationService);
  private readonly authService = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly isEditMode = signal(false);
  protected readonly vehicleId = signal<string | null>(null);
  protected readonly alertMessage = signal<{ type: 'error' | 'success'; title: string; details?: string[] } | null>(null);
  protected readonly isSubmitting = signal(false);

  protected readonly vehicleForm: FormGroup;

  // Premium feature validator
  protected readonly isPremiumUser = computed(() => {
    const user = this.authService.currentUser();
    return user !== null;
  });

  // Especificaciones
  protected readonly specificationGroups = signal<SpecificationGroup[]>([]);
  protected readonly selectedSpecs = signal<number[]>([]);

  // Visuales Base64 state
  protected readonly imagenPrincipalPreview = signal<string>('');
  protected readonly galleryImages = signal<string[]>([]);

  // Modal para agregar especificación
  protected readonly isAddSpecModalOpen = signal(false);
  protected readonly newSpecName = signal('');
  protected readonly newSpecGroupId = signal<number>(0);
  protected readonly newSpecError = signal('');

  constructor() {
    this.vehicleForm = this.fb.group({
      nombre: ['', [Validators.required]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      anio: [new Date().getFullYear(), [Validators.required, Validators.min(1900)]],
      precio: [0, [Validators.required, Validators.min(1)]],
      moneda: ['USD', [Validators.required]],
      categoria: ['autos', [Validators.required]],
      tipoCombustible: ['Gasolina', [Validators.required]],
      transmision: ['Automática', [Validators.required]],
      kilometraje: [0, [Validators.required, Validators.min(0)]],
      condicion: ['usado', [Validators.required]],
      ubicacion: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      telefonoContacto: ['59177490451', [Validators.required, Validators.pattern(/^[\+0-9\s\-]+$/)]],
      destacado: [false],
      estado: ['disponible', [Validators.required]],
      // Autos
      autoCarroceria: [''],
      autoPuertas: [4],
      autoPasajeros: [5],
      autoAutonomia: [null],
      autoTamanoBateria: [null],
      // Motos
      motoCilindrada: [125],
      motoTipoMoto: [''],
      motoAutonomia: [null],
      motoTamanoBateria: [null],
      // Maquinaria
      maquinariaPesoOperativo: [1000],
      maquinariaHorasUso: [0]
    });
  }

  public ngOnInit(): void {
    // Cargar grupos de especificaciones
    this.loadSpecs();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode.set(true);
        this.vehicleId.set(id);
        this.loadVehicleData(id);
      }
    });
  }

  private async loadSpecs(): Promise<void> {
    const groups = await this.specService.getGroups();
    this.specificationGroups.set(groups);
    if (groups.length > 0) {
      this.newSpecGroupId.set(groups[0].id);
    }
  }

  private async loadVehicleData(id: string): Promise<void> {
    const v = await this.vehicleService.getVehicleById(id);
    if (v) {
      this.vehicleForm.patchValue({
        nombre: v.nombre,
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio,
        precio: v.precio,
        moneda: v.moneda || 'USD',
        categoria: v.categoria,
        tipoCombustible: v.tipoCombustible,
        transmision: v.transmision,
        kilometraje: v.kilometraje,
        condicion: v.condicion,
        ubicacion: v.ubicacion,
        descripcion: v.descripcion,
        telefonoContacto: v.telefonoContacto || '59177490451',
        destacado: v.destacado,
        estado: v.estado,
        autoCarroceria: v.autoDetail?.carroceria || '',
        autoPuertas: v.autoDetail?.puertas || 4,
        autoPasajeros: v.autoDetail?.pasajeros || 5,
        autoAutonomia: v.autoDetail?.autonomia || null,
        autoTamanoBateria: v.autoDetail?.tamanoBateria || null,
        motoCilindrada: v.motoDetail?.cilindrada || 125,
        motoTipoMoto: v.motoDetail?.tipoMoto || '',
        motoAutonomia: v.motoDetail?.autonomia || null,
        motoTamanoBateria: v.motoDetail?.tamanoBateria || null,
        maquinariaPesoOperativo: v.maquinariaDetail?.pesoOperativo || 1000,
        maquinariaHorasUso: v.maquinariaDetail?.horasUso || 0
      });

      if (v.imagenPrincipal) {
        this.imagenPrincipalPreview.set(v.imagenPrincipal);
      }
      if (v.imagenes && v.imagenes.length > 0) {
        this.galleryImages.set(v.imagenes);
      }

      if (v.especificaciones) {
        this.selectedSpecs.set(v.especificaciones.map(s => s.id));
      }
    } else {
      this.router.navigate(['/admin']);
    }
  }

  protected onCategoryChange(): void {
    const cat = this.vehicleForm.get('categoria')?.value;
    if (cat === 'maquinaria' || cat === 'maquinaria_agricola' || cat === 'transporte_pesado') {
      this.vehicleForm.patchValue({
        tipoCombustible: 'Diésel',
        transmision: 'Hidrostática'
      });
    } else if (cat === 'motos') {
      this.vehicleForm.patchValue({
        tipoCombustible: 'Gasolina',
        transmision: 'Manual'
      });
    } else if (cat === 'autos_electricos' || cat === 'motos_electricos') {
      this.vehicleForm.patchValue({
        tipoCombustible: 'Eléctrico',
        transmision: 'Automática'
      });
    }
  }

  // Image Upload Methods
  protected removeImagenPrincipal(): void {
    this.imagenPrincipalPreview.set('');
  }

  protected async onMainFileSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      try {
        const file = input.files[0];
        const compressedBase64 = await compressImage(file, 1600, 900, 0.82);
        this.imagenPrincipalPreview.set(compressedBase64);
      } catch (err) {
        console.error('Error al comprimir imagen principal:', err);
      }
    }
  }

  protected async onGalleryFilesSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      try {
        const compressPromises = files.map(file => compressImage(file, 1600, 900, 0.82));
        const compressedList = await Promise.all(compressPromises);
        this.galleryImages.set([...this.galleryImages(), ...compressedList]);
      } catch (err) {
        console.error('Error al comprimir imágenes de galería:', err);
      }
    }
  }

  protected removeGalleryImage(index: number): void {
    const current = this.galleryImages();
    this.galleryImages.set(current.filter((_, i) => i !== index));
  }

  protected toggleSpec(id: number): void {
    const current = this.selectedSpecs();
    if (current.includes(id)) {
      this.selectedSpecs.set(current.filter(x => x !== id));
    } else {
      this.selectedSpecs.set([...current, id]);
    }
  }

  // Operaciones del Modal de especificación
  protected openAddSpecModal(): void {
    this.newSpecName.set('');
    this.newSpecError.set('');
    this.isAddSpecModalOpen.set(true);
  }

  protected closeAddSpecModal(): void {
    this.isAddSpecModalOpen.set(false);
  }

  protected async submitNewSpec(): Promise<void> {
    const name = this.newSpecName().trim();
    const groupId = Number(this.newSpecGroupId());
    
    if (name && groupId) {
      const spec = await this.specService.createSpecification(name, groupId);
      if (spec) {
        // Recargar especificaciones de la base de datos
        await this.loadSpecs();
        // Auto-seleccionar la nueva especificación
        this.selectedSpecs.set([...this.selectedSpecs(), spec.id]);
        this.closeAddSpecModal();
      } else {
        this.newSpecError.set('Error al guardar la especificación. Es posible que ya exista.');
      }
    }
  }

  protected async onSubmit(): Promise<void> {
    this.alertMessage.set(null);
    this.vehicleForm.markAllAsTouched();

    const mainImg = this.imagenPrincipalPreview();
    const missingFields: string[] = [];

    if (this.vehicleForm.get('nombre')?.invalid) missingFields.push('Nombre Comercial es requerido');
    if (this.vehicleForm.get('marca')?.invalid) missingFields.push('Marca es requerida');
    if (this.vehicleForm.get('modelo')?.invalid) missingFields.push('Modelo es requerido');
    if (this.vehicleForm.get('anio')?.invalid) missingFields.push('Año debe ser un valor válido (mínimo 1900)');
    if (this.vehicleForm.get('precio')?.invalid) missingFields.push('Precio debe ser mayor a 0');
    if (this.vehicleForm.get('ubicacion')?.invalid) missingFields.push('Ubicación física es requerida');
    if (this.vehicleForm.get('descripcion')?.invalid) missingFields.push('Descripción debe tener al menos 10 caracteres');
    if (this.vehicleForm.get('telefonoContacto')?.invalid) missingFields.push('Teléfono de contacto es requerido (ej. +591 77490451)');
    if (!mainImg) missingFields.push('Debe cargar la Imagen Principal del vehículo');

    if (this.vehicleForm.invalid || !mainImg) {
      this.alertMessage.set({
        type: 'error',
        title: 'Por favor completa los siguientes campos obligatorios antes de guardar:',
        details: missingFields
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    this.isSubmitting.set(true);

    try {
      let imagenes = this.galleryImages();
      if (imagenes.length === 0) {
        imagenes = [mainImg];
      }

      const formValue = this.vehicleForm.value;

      const vehicleData: any = {
        nombre: formValue.nombre,
        marca: formValue.marca,
        modelo: formValue.modelo,
        anio: Number(formValue.anio),
        precio: Number(formValue.precio),
        moneda: formValue.moneda,
        categoria: formValue.categoria,
        tipoCombustible: formValue.tipoCombustible,
        transmision: formValue.transmision,
        kilometraje: Number(formValue.kilometraje),
        condicion: formValue.condicion,
        ubicacion: formValue.ubicacion,
        imagenPrincipal: mainImg,
        imagenes: imagenes,
        descripcion: formValue.descripcion,
        telefonoContacto: formValue.telefonoContacto,
        destacado: formValue.destacado,
        estado: formValue.estado,
        especificaciones: this.selectedSpecs()
      };

      if (formValue.categoria === 'autos' || formValue.categoria === 'autos_electricos') {
        vehicleData.autoDetail = {
          carroceria: formValue.autoCarroceria,
          puertas: Number(formValue.autoPuertas),
          pasajeros: Number(formValue.autoPasajeros),
          autonomia: formValue.autoAutonomia ? Number(formValue.autoAutonomia) : null,
          tamanoBateria: formValue.autoTamanoBateria ? Number(formValue.autoTamanoBateria) : null
        };
      } else if (formValue.categoria === 'motos' || formValue.categoria === 'motos_electricos') {
        vehicleData.motoDetail = {
          cilindrada: Number(formValue.motoCilindrada),
          tipoMoto: formValue.motoTipoMoto,
          autonomia: formValue.motoAutonomia ? Number(formValue.motoAutonomia) : null,
          tamanoBateria: formValue.motoTamanoBateria ? Number(formValue.motoTamanoBateria) : null
        };
      } else if (formValue.categoria === 'maquinaria' || formValue.categoria === 'maquinaria_agricola' || formValue.categoria === 'transporte_pesado') {
        vehicleData.maquinariaDetail = {
          pesoOperativo: Number(formValue.maquinariaPesoOperativo),
          horasUso: Number(formValue.maquinariaHorasUso)
        };
      }

      if (this.isEditMode() && this.vehicleId()) {
        await this.vehicleService.updateVehicle(this.vehicleId()!, vehicleData);
      } else {
        await this.vehicleService.createVehicle(vehicleData);
      }

      this.alertMessage.set({
        type: 'success',
        title: this.isEditMode() ? '¡Cambios guardados con éxito!' : '¡Vehículo registrado con éxito!'
      });

      setTimeout(() => {
        this.router.navigate(['/admin']);
      }, 1000);

    } catch (err: any) {
      console.error('Error al guardar vehículo:', err);
      this.alertMessage.set({
        type: 'error',
        title: 'Error al guardar los cambios en el servidor:',
        details: [err.message || 'Ocurrió un error inesperado al conectar con el servidor.']
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      this.isSubmitting.set(false);
    }
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.vehicleForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
