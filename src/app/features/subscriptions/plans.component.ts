import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule, UpperCasePipe],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 fade-in">
      
      <!-- Section Header -->
      <div class="text-center">
        <h2 class="text-xs font-bold uppercase tracking-widest text-blue-600">Planes de Precios</h2>
        <p class="mt-2 font-heading text-4xl font-extrabold text-slate-900 sm:text-5xl">Elige el plan ideal para vender</p>
        <p class="mt-4 text-lg text-slate-500 max-w-2xl mx-auto">Tanto si quieres vender tu auto particular como si eres una concesionaria con cientos de vehículos, tenemos la escala adecuada para ti.</p>
      </div>

      <!-- Plans Grid -->
      <div class="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
        
        <!-- PLAN 1: Gratis -->
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between relative">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Gratis (personal)</h3>
            <p class="mt-4 text-sm text-slate-500">Perfecto para vender tu vehículo de uso particular.</p>
            <p class="mt-8 flex items-baseline">
              <span class="text-5xl font-extrabold tracking-tight text-slate-900">$0</span>
              <span class="ml-1 text-sm font-semibold text-slate-500">/ mes</span>
            </p>
            <span class="text-xs text-slate-400 line-through">Antes $19.99 / mes</span>

            <ul class="mt-8 space-y-4">
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 2 cuotas de listado activas
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> período de publicación de 7 días
              </li>
              <li class="flex items-start text-xs text-slate-400 line-through">
                <span class="text-rose-500 font-bold mr-2">✗</span> Crédito de listado premium
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito clasificado gratuito
              </li>
              <li class="flex items-start text-xs text-slate-400 line-through">
                <span class="text-rose-500 font-bold mr-2">✗</span> Créditos clasificados premium
              </li>
              <li class="flex items-start text-xs text-slate-400 line-through">
                <span class="text-rose-500 font-bold mr-2">✗</span> Cuota del artículo
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito de artículo premium
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 3 selecciones múltiples
              </li>
              <li class="flex items-start text-xs text-slate-400 line-through">
                <span class="text-rose-500 font-bold mr-2">✗</span> Actualizaciones en directo
              </li>
            </ul>
          </div>

          <button (click)="selectPlan('gratis')" 
                  [disabled]="currentPlan() === 'gratis'"
                  class="mt-8 w-full rounded-2xl py-3 px-4 text-center text-sm font-bold shadow transition-all focus:outline-none"
                  [class]="currentPlan() === 'gratis' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'">
            {{ currentPlan() === 'gratis' ? 'Tu Plan Activo' : 'Consíguelo Gratis' }}
          </button>
        </div>

        <!-- PLAN 2: Negocio -->
        <div class="rounded-3xl border-2 border-blue-600 bg-white p-8 shadow-md flex flex-col justify-between relative">
          <div class="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-4 py-1 text-xs font-bold text-white uppercase tracking-wider">
            Popular
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-900">Negocio (distribuidores)</h3>
            <p class="mt-4 text-sm text-slate-500">Para agencias medianas que buscan una rotación continua.</p>
            <p class="mt-8 flex items-baseline">
              <span class="text-5xl font-extrabold tracking-tight text-slate-900">$19</span>
              <span class="ml-1 text-sm font-semibold text-slate-500">/ mes</span>
            </p>
            <span class="text-xs text-slate-400 line-through">Antes $49.99 / mes</span>

            <ul class="mt-8 space-y-4">
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 60 cuotas de listado activas
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Período de publicación ilimitado
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito de listado premium
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito clasificado gratuito
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 100 créditos premium clasificados
              </li>
              <li class="flex items-start text-xs text-slate-400 line-through">
                <span class="text-rose-500 font-bold mr-2">✗</span> Cuota del artículo
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito de artículo premium
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 3 selecciones múltiples
              </li>
              <li class="flex items-start text-xs text-slate-400 line-through">
                <span class="text-rose-500 font-bold mr-2">✗</span> Actualizaciones en directo
              </li>
            </ul>
          </div>

          <button (click)="selectPlan('negocio')"
                  [disabled]="currentPlan() === 'negocio'"
                  class="mt-8 w-full rounded-2xl py-3 px-4 text-center text-sm font-bold shadow transition-all focus:outline-none"
                  [class]="currentPlan() === 'negocio' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-200'">
            {{ currentPlan() === 'negocio' ? 'Tu Plan Activo' : 'Consiga Negocios' }}
          </button>
        </div>

        <!-- PLAN 3: Empresa -->
        <div class="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col justify-between relative">
          <div>
            <h3 class="text-lg font-bold text-slate-900">Empresa (distribuidores)</h3>
            <p class="mt-4 text-sm text-slate-500">La solución definitiva para importadores y grandes concesionarias.</p>
            <p class="mt-8 flex items-baseline">
              <span class="text-5xl font-extrabold tracking-tight text-slate-900">$49</span>
              <span class="ml-1 text-sm font-semibold text-slate-500">/ mes</span>
            </p>
            <span class="text-xs text-slate-400 line-through">Antes $99.99 / mes</span>

            <ul class="mt-8 space-y-4">
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 300 cuotas de listados activos
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Período de publicación ilimitado
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito de listado premium
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito clasificado gratuito
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 400 créditos premium clasificados
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Cuota del artículo
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Crédito de artículo premium
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> 50 selecciones múltiples
              </li>
              <li class="flex items-start text-xs text-slate-600">
                <span class="text-emerald-500 font-bold mr-2">✓</span> Actualizaciones en directo
              </li>
            </ul>
          </div>

          <button (click)="selectPlan('empresa')"
                  [disabled]="currentPlan() === 'empresa'"
                  class="mt-8 w-full rounded-2xl py-3 px-4 text-center text-sm font-bold shadow transition-all focus:outline-none"
                  [class]="currentPlan() === 'empresa' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-slate-800'">
            {{ currentPlan() === 'empresa' ? 'Tu Plan Activo' : 'Obtenga Enterprise' }}
          </button>
        </div>

      </div>

      <!-- MODAL: Solicitud de Pago vía WhatsApp -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl relative">
            <button (click)="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="font-heading text-xl font-bold text-slate-900">Solicitar Activación de Plan</h3>
            <p class="text-xs text-slate-500 mt-2">Para contratar el plan <strong class="text-slate-800 uppercase">{{ planToSubscribe() }}</strong> (\${{ planPrice() }}/mes), debes enviar una solicitud al administrador a través de WhatsApp. Tu plan será activado de manera manual.</p>
            
            <p class="text-xs font-semibold text-slate-700 mt-4">Mensaje que se enviará:</p>
            <div class="mt-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-600 italic">
              "Hola, soy {{ authName() }} ({{ authEmail() }}) y deseo contratar el plan {{ planToSubscribe() | uppercase }} para mi cuenta. Por favor actívenlo."
            </div>

            <div class="mt-6 flex flex-col gap-2">
              <a [href]="whatsappLink()" target="_blank" (click)="closeModal()"
                 class="w-full text-center rounded-xl bg-emerald-600 text-white py-3 text-sm font-bold shadow-md hover:bg-emerald-500 transition-all flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.012 2c-5.506 0-9.988 4.482-9.988 9.988 0 1.761.459 3.472 1.332 4.984l-1.417 5.176 5.302-1.391a9.92 9.92 0 0 0 4.771 1.22h.005c5.505 0 9.988-4.483 9.988-9.988 0-2.666-1.038-5.172-2.924-7.058C17.18 3.037 14.678 2 12.012 2zm5.727 13.916c-.25.704-1.25 1.285-1.72 1.341-.47.056-.941.084-2.983-.761-2.613-1.077-4.277-3.738-4.407-3.911-.13-.173-1.038-1.378-1.038-2.628 0-1.25.654-1.865.888-2.112.234-.247.513-.309.684-.309.172 0 .343.003.493.01.156.007.362-.058.567.438.21.507.72 1.758.784 1.888.064.13.108.281.022.453-.086.172-.13.281-.259.432-.13.15-.272.336-.389.45-.13.125-.266.26-.115.519.151.259.673 1.109 1.442 1.796.993.884 1.827 1.159 2.086 1.288.259.129.41.108.561-.065.151-.173.647-.754.82-1.013.173-.259.345-.216.582-.129.237.086 1.509.712 1.768.841.259.129.431.194.494.302.063.108.063.626-.187 1.33z"/>
                </svg>
                Enviar Solicitud
              </a>
              <button (click)="closeModal()" class="w-full text-center rounded-xl bg-slate-100 text-slate-700 py-3 text-sm font-semibold hover:bg-slate-200 transition-all">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class PlansComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly currentPlan = signal<'gratis' | 'negocio' | 'empresa'>('gratis');

  // Modal State
  protected readonly isModalOpen = signal(false);
  protected readonly planToSubscribe = signal<'gratis' | 'negocio' | 'empresa'>('gratis');
  protected readonly planPrice = signal(0);

  protected readonly authName = computed(() => this.authService.currentUser()?.nombre || '');
  protected readonly authEmail = computed(() => this.authService.currentUser()?.email || '');

  protected readonly whatsappLink = computed(() => {
    const text = `Hola, deseo contratar el plan ${this.planToSubscribe().toUpperCase()} para mi cuenta. Nombre: ${this.authName()}, Email: ${this.authEmail()}.`;
    return `https://wa.me/59177490451?text=${encodeURIComponent(text)}`;
  });

  constructor() {
    const user = this.authService.currentUser();
    if (user && user.plan) {
      this.currentPlan.set(user.plan);
    }
  }

  protected async selectPlan(plan: 'gratis' | 'negocio' | 'empresa'): Promise<void> {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/autenticacion']);
      return;
    }

    if (plan === 'gratis') {
      // Activar gratis de inmediato
      await this.authService.subscribe('gratis');
      this.currentPlan.set('gratis');
      return;
    }

    // Abrir modal de solicitud vía WhatsApp para planes premium
    this.planToSubscribe.set(plan);
    this.planPrice.set(plan === 'negocio' ? 19 : 49);
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }
}
