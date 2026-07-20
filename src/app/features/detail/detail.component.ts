import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe, DecimalPipe } from '@angular/common';
import { VehicleService } from '../../core/services/vehicle.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ComparisonService } from '../../core/services/comparison.service';
import { Vehicle, Specification } from '../../core/models/vehicle.model';
import { QuoteService } from '../../core/services/quote.service';
import { ReservationService } from '../../core/services/reservation.service';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, FormsModule, CurrencyPipe, DecimalPipe],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      @if (vehicle(); as v) {
        
        <!-- Navigation Breadcrumbs -->
        <nav class="mb-6 flex text-xs font-semibold text-slate-500 gap-2">
          <a routerLink="/" class="hover:text-blue-600">Inicio</a>
          <span>/</span>
          <a routerLink="/catalogo" class="hover:text-blue-600">Catálogo</a>
          <span>/</span>
          <a routerLink="/catalogo" [queryParams]="{categoria: v.categoria}" class="hover:text-blue-600 capitalize">{{ v.categoria }}</a>
          <span>/</span>
          <span class="text-slate-800 font-bold truncate">{{ v.nombre }}</span>
        </nav>

        <!-- Main Product Grid -->
        <div class="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          <!-- Column 1: Gallery (7/12 cols) -->
          <div class="lg:col-span-7 space-y-4">
            
            <!-- Large Image Frame -->
            <div class="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
              <span class="absolute top-4 left-4 z-10 inline-flex items-center rounded-md px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-sm"
                    [class]="statusBadgeClass()">
                {{ statusText() }}
              </span>

              <img [src]="activeImage()" [alt]="v.nombre" class="h-full w-full object-cover" />
            </div>

            <!-- Thumbnail Carousel Grid -->
            @if (v.imagenes && v.imagenes.length > 0) {
              <div class="flex gap-3 overflow-x-auto pb-2">
                @for (img of v.imagenes; track img) {
                  <button (click)="setActiveImage(img)"
                          class="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-all"
                          [class.border-blue-600]="activeImage() === img"
                          [class.border-transparent]="activeImage() !== img">
                    <img [src]="img" class="h-full w-full object-cover" alt="Miniatura" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Column 2: Buy details & actions (5/12 cols) -->
          <div class="lg:col-span-5 flex flex-col justify-between">
            <div>
              <!-- Category and Condition -->
              <div class="flex items-center justify-between">
                <span class="text-xs font-semibold uppercase tracking-widest text-blue-600">{{ v.categoria }}</span>
                <span class="rounded bg-slate-200 px-2 py-0.5 text-[11px] font-bold text-slate-800 capitalize">{{ v.condicion }}</span>
              </div>

              <!-- Title & Price -->
              <h1 class="mt-4 font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{{ v.nombre }}</h1>
              
              <div class="mt-6 rounded-2xl bg-slate-100 p-6">
                <div class="flex items-end justify-between">
                  <div>
                    <span class="text-xs font-medium text-slate-500 uppercase">Precio Especial de Venta</span>
                    <p class="font-heading text-3xl font-extrabold text-slate-950 mt-1">
                      {{ v.precio | currency:'USD':'symbol':'1.0-0' }}
                    </p>
                  </div>
                  <span class="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Entrega inmediata
                  </span>
                </div>
              </div>

              <!-- Summary Specifications -->
              <div class="mt-8 grid grid-cols-2 gap-4 border-b border-slate-200 pb-8">
                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-slate-400">Año de Modelo</span>
                    <span class="text-sm font-semibold text-slate-900">{{ v.anio }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-slate-400">Kilometraje</span>
                    <span class="text-sm font-semibold text-slate-900">{{ v.kilometraje | number:'1.0-0' }} km</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-slate-400">Transmisión</span>
                    <span class="text-sm font-semibold text-slate-900">{{ v.transmision }}</span>
                  </div>
                </div>

                <div class="flex items-center gap-3">
                  <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <span class="block text-[10px] uppercase font-bold text-slate-400">Ubicación</span>
                    <span class="text-sm font-semibold text-slate-900 truncate max-w-[150px]" [title]="v.ubicacion">{{ v.ubicacion }}</span>
                  </div>
                </div>
                
                @if (v.categoria === 'autos' && v.autoDetail) {
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-slate-400">Carrocería</span>
                      <span class="text-sm font-semibold text-slate-900">{{ v.autoDetail.carroceria }}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-slate-400">Pasajeros / Puertas</span>
                      <span class="text-sm font-semibold text-slate-900">{{ v.autoDetail.pasajeros }} asientos / {{ v.autoDetail.puertas }}p</span>
                    </div>
                  </div>
                }

                @if (v.categoria === 'motos' && v.motoDetail) {
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-slate-400">Cilindrada</span>
                      <span class="text-sm font-semibold text-slate-900">{{ v.motoDetail.cilindrada }} cc</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-slate-400">Tipo de Moto</span>
                      <span class="text-sm font-semibold text-slate-900">{{ v.motoDetail.tipoMoto }}</span>
                    </div>
                  </div>
                }

                @if (v.categoria === 'maquinaria' && v.maquinariaDetail) {
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-slate-400">Peso Operativo</span>
                      <span class="text-sm font-semibold text-slate-900">{{ v.maquinariaDetail.pesoOperativo | number:'1.0-0' }} kg</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-[10px] uppercase font-bold text-slate-400">Horas de Uso</span>
                      <span class="text-sm font-semibold text-slate-900">{{ v.maquinariaDetail.horasUso }} hrs</span>
                    </div>
                  </div>
                }
              </div>

              <!-- Description -->
              <div class="mt-8">
                <h3 class="text-sm font-bold text-slate-950 uppercase tracking-wider">Descripción del Vehículo</h3>
                <p class="mt-3 text-sm text-slate-600 leading-relaxed">{{ v.descripcion }}</p>
              </div>

            </div>

            <!-- CTA Action Buttons -->
            <div class="mt-10 space-y-3 pt-6 border-t border-slate-200">
              <div class="flex gap-3">
                <button (click)="openQuoteModal()"
                        class="flex-1 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 py-3.5 text-sm font-bold transition-all focus:outline-none">
                  Solicitar Cotización
                </button>
                
                @if (v.estado === 'disponible') {
                  <button (click)="openReserveModal()"
                          class="flex-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3.5 text-sm font-bold shadow-md transition-all focus:outline-none">
                    Reservar Unidad
                  </button>
                } @else {
                  <button disabled
                          class="flex-1 rounded-xl bg-slate-300 text-slate-500 py-3.5 text-sm font-bold cursor-not-allowed">
                    No disponible para reserva
                  </button>
                }
              </div>

              <div class="flex gap-2">
                <!-- WhatsApp CTA button -->
                <a [href]="whatsAppLink()" target="_blank" rel="noopener noreferrer"
                   class="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 text-sm font-bold transition-all shadow">
                  <svg class="h-5 w-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.703 1.458h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Consultar WhatsApp
                </a>

                <!-- Favorite / Compare buttons -->
                <button (click)="toggleFavorite()" 
                        class="flex h-12 w-12 items-center justify-center rounded-xl border focus:outline-none transition-colors"
                        [class]="isFavorite() ? 'border-red-100 bg-red-50 text-red-500 hover:bg-red-100' : 'border-slate-200 bg-white text-slate-400 hover:text-red-500 hover:bg-slate-50'"
                        title="Favorito">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" [attr.fill]="isFavorite() ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>

                <button (click)="toggleComparison()" 
                        class="flex h-12 w-12 items-center justify-center rounded-xl border focus:outline-none transition-colors"
                        [class]="isCompared() ? 'border-blue-100 bg-blue-50 text-blue-600 hover:bg-blue-100' : 'border-slate-200 bg-white text-slate-400 hover:text-blue-600 hover:bg-slate-50'"
                        title="Comparar">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                  </svg>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Specifications Section -->
        <section class="mt-16 border-t border-slate-200 pt-12">
          <h2 class="font-heading text-2xl font-bold text-slate-900">Equipamiento y Características</h2>
          <p class="text-slate-500 text-sm mt-1">Detalles de confort, seguridad y especificaciones adicionales</p>

          <div class="mt-8 space-y-8">
            @for (group of groupedSpecifications(); track group.name) {
              <div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <h3 class="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 mb-4">{{ group.name }}</h3>
                <div class="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  @for (spec of group.specs; track spec.id) {
                    <div class="flex items-center gap-2 text-sm text-slate-700 bg-slate-50/50 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-100 transition-colors">
                      <span class="h-2 w-2 rounded-full bg-blue-500 shrink-0"></span>
                      <span class="font-medium text-slate-800">{{ spec.nombre }}</span>
                    </div>
                  }
                </div>
              </div>
            } @empty {
              <div class="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <p class="text-sm text-slate-400">Este vehículo no tiene equipamiento específico registrado.</p>
              </div>
            }
          </div>
        </section>

      } @else {
        <!-- Error / Loading view -->
        <div class="py-24 text-center">
          <h2 class="font-heading text-2xl font-bold text-slate-900">Vehículo no encontrado</h2>
          <p class="text-slate-500 mt-2">El ID solicitado no corresponde a ningún vehículo en nuestro inventario actual.</p>
          <a routerLink="/catalogo" class="mt-6 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-500">
            Regresar al catálogo
          </a>
        </div>
      }

      <!-- MODAL: Solicitar Cotización -->
      @if (isQuoteModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-lg bg-white rounded-2xl p-8 shadow-2xl relative">
            <button (click)="closeQuoteModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h3 class="font-heading text-2xl font-bold text-slate-900">Solicitar Cotización</h3>
            <p class="text-xs text-slate-500 mt-1">Completa los campos para recibir una cotización formal de: <strong class="text-slate-700">{{ vehicle()?.nombre }}</strong></p>

            @if (quoteFormSubmitted()) {
              <div class="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-800 border border-emerald-100 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="font-semibold text-sm">¡Cotización enviada!</p>
                  <p class="text-xs text-emerald-600 mt-0.5">Un asesor de finanzas te contactará vía correo electrónico.</p>
                </div>
              </div>
            } @else {
              <form [formGroup]="quoteForm" (ngSubmit)="submitQuote()" class="mt-6 space-y-4">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 uppercase">Nombre Completo</label>
                  <input type="text" formControlName="nombre" 
                         class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                         [class.border-red-400]="isQuoteFieldInvalid('nombre')" />
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase">Email</label>
                    <input type="email" formControlName="email" 
                           class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                           [class.border-red-400]="isQuoteFieldInvalid('email')" />
                  </div>
                  <div>
                    <label class="block text-xs font-semibold text-slate-600 uppercase">Teléfono</label>
                    <input type="tel" formControlName="telefono" 
                           class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                           [class.border-red-400]="isQuoteFieldInvalid('telefono')" />
                  </div>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 uppercase">Mensaje (Opcional)</label>
                  <textarea formControlName="mensaje" rows="3" 
                            class="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"></textarea>
                </div>
                <button type="submit" [disabled]="quoteForm.invalid"
                        class="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
                  Enviar Solicitud
                </button>
              </form>
            }
          </div>
        </div>
      }

      <!-- MODAL: Reservar Unidad (Simulación) -->
      @if (isReserveModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl relative">
            <button (click)="closeReserveModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="font-heading text-2xl font-bold text-slate-900">Reservar Unidad</h3>
            <p class="text-xs text-slate-500 mt-1">Separa este vehículo abonando un pago inicial simulado.</p>

            @if (reserveFinished()) {
              <div class="mt-6 rounded-lg bg-emerald-50 p-4 text-emerald-800 border border-emerald-100 flex gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                </svg>
                <div>
                  <p class="font-semibold text-sm">¡Unidad Reservada!</p>
                  <p class="text-xs text-emerald-600 mt-0.5">El estado del vehículo ha cambiado a 'Reservado' en el inventario.</p>
                </div>
              </div>
            } @else {
              <div class="mt-6 border border-slate-200/80 rounded-xl p-4 bg-slate-50 space-y-2 text-xs">
                <div class="flex justify-between font-medium">
                  <span class="text-slate-500">Modelo:</span>
                  <span class="text-slate-800 font-bold">{{ vehicle()?.nombre }}</span>
                </div>
                <div class="flex justify-between font-medium">
                  <span class="text-slate-500">Monto de Reserva:</span>
                  <span class="text-slate-800 font-extrabold text-sm">$500.00 USD</span>
                </div>
                <p class="text-[10px] text-slate-400 mt-2 text-justify">Este pago inicial de $500 USD garantiza que la unidad sea bloqueada de la venta pública por 48 horas mientras se realiza el papeleo oficial.</p>
              </div>

              <!-- Payment Method Mock selection -->
              <div class="mt-6">
                <label class="block text-xs font-semibold text-slate-600 uppercase">Selecciona Método de Pago</label>
                <div class="mt-2.5 space-y-2">
                  <label class="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                    <input type="radio" name="payment" value="visa" checked class="text-blue-600" />
                    <span>Tarjeta de Crédito / Débito (Simulado)</span>
                  </label>
                  <label class="flex items-center gap-2.5 rounded-lg border border-slate-200 p-3 text-xs text-slate-700 cursor-pointer hover:bg-slate-50">
                    <input type="radio" name="payment" value="transfer" class="text-blue-600" />
                    <span>Transferencia Bancaria (Simulado)</span>
                  </label>
                </div>
              </div>

              <button (click)="confirmReservation()"
                      class="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors">
                Confirmar Reserva Simulada ($500)
              </button>
            }
          </div>
        </div>
      }

    </div>
  `
})
export class DetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly vehicleService = inject(VehicleService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly comparisonService = inject(ComparisonService);
  private readonly quoteService = inject(QuoteService);
  private readonly reservationService = inject(ReservationService);
  private readonly fb = inject(FormBuilder);

  protected readonly vehicleId = signal<string>('');
  
  protected readonly vehicle = computed(() => 
    this.vehicleService.vehicles().find(v => v.id === this.vehicleId())
  );

  protected readonly activeImage = signal<string>('');
  protected readonly isFavorite = computed(() => this.favoriteService.isFavorite(this.vehicleId()));
  protected readonly isCompared = computed(() => this.comparisonService.isCompared(this.vehicleId()));

  // Modals controllers
  protected readonly isQuoteModalOpen = signal(false);
  protected readonly quoteFormSubmitted = signal(false);
  protected readonly quoteForm: FormGroup;

  protected readonly isReserveModalOpen = signal(false);
  protected readonly reserveFinished = signal(false);

  constructor() {
    this.quoteForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      mensaje: ['']
    });
  }

  public ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id') || '';
      this.vehicleId.set(id);
      
      // Inicializar imagen principal activa
      const currentVehicle = this.vehicle();
      if (currentVehicle) {
        this.activeImage.set(currentVehicle.imagenPrincipal);
      }
    });
  }

  protected setActiveImage(url: string): void {
    this.activeImage.set(url);
  }

  protected readonly groupedSpecifications = computed(() => {
    const v = this.vehicle();
    if (!v || !v.especificaciones) return [];
    
    const groups: { [key: string]: Specification[] } = {};
    for (const spec of v.especificaciones) {
      const groupName = spec.grupo?.nombre || 'General';
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      groups[groupName].push(spec);
    }
    
    return Object.entries(groups).map(([name, specs]) => ({
      name,
      specs
    }));
  });

  protected readonly statusText = computed(() => {
    const estado = this.vehicle()?.estado;
    if (estado === 'disponible') return 'Disponible';
    if (estado === 'reservado') return 'Reservado';
    return 'Vendido';
  });

  protected readonly statusBadgeClass = computed(() => {
    const estado = this.vehicle()?.estado;
    if (estado === 'disponible') return 'bg-emerald-500';
    if (estado === 'reservado') return 'bg-amber-500';
    return 'bg-rose-500';
  });

  protected readonly whatsAppLink = computed(() => {
    const v = this.vehicle();
    if (!v) return '';
    const text = encodeURIComponent(`Hola, me interesa el vehículo ${v.nombre} ($${v.precio} USD). ¿Sigue disponible?`);
    return `https://wa.me/59177490451?text=${text}`; // WhatsApp is admin number
  });

  protected toggleFavorite(): void {
    this.favoriteService.toggleFavorite(this.vehicleId());
  }

  protected toggleComparison(): void {
    const v = this.vehicle();
    if (v) {
      this.comparisonService.toggleComparison(v);
    }
  }

  // Modals operations
  protected openQuoteModal(): void {
    this.quoteFormSubmitted.set(false);
    this.isQuoteModalOpen.set(true);
  }

  protected closeQuoteModal(): void {
    this.isQuoteModalOpen.set(false);
  }

  protected async submitQuote(): Promise<void> {
    if (this.quoteForm.valid) {
      const success = await this.quoteService.submitQuote({
        nombre: this.quoteForm.value.nombre,
        email: this.quoteForm.value.email,
        telefono: this.quoteForm.value.telefono,
        mensaje: this.quoteForm.value.mensaje,
        vehicleId: this.vehicleId(),
      });
      if (success) {
        this.quoteFormSubmitted.set(true);
        setTimeout(() => {
          this.closeQuoteModal();
          this.quoteForm.reset();
        }, 3500);
      }
    }
  }

  protected isQuoteFieldInvalid(fieldName: string): boolean {
    const field = this.quoteForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  protected openReserveModal(): void {
    this.reserveFinished.set(false);
    this.isReserveModalOpen.set(true);
  }

  protected closeReserveModal(): void {
    this.isReserveModalOpen.set(false);
  }

  protected async confirmReservation(): Promise<void> {
    const success = await this.reservationService.createReservation(
      this.vehicleId(),
      'visa',
      500
    );

    if (success) {
      this.reserveFinished.set(true);
      await this.vehicleService.refreshVehicles();
      
      setTimeout(() => {
        this.closeReserveModal();
      }, 3500);
    }
  }
}
