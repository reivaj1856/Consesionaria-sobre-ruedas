import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuoteService } from '../../core/services/quote.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="border-b border-slate-200 pb-5">
        <h1 class="font-heading text-3xl font-extrabold text-slate-900">Contacto y Sucursales</h1>
        <p class="mt-2 text-sm text-slate-500">Estamos aquí para resolver tus inquietudes y guiarte en tu adquisición</p>
      </div>

      <!-- Main Layout -->
      <div class="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12">
        
        <!-- Column 1: Info Cards (5/12 cols) -->
        <div class="lg:col-span-5 space-y-6">
          <h2 class="font-heading text-xl font-bold text-slate-900">Información de Sucursal</h2>
          
          <!-- Branch Card -->
          <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-2">
              <span class="inline-flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              <h3 class="font-heading text-base font-bold text-slate-900">Casa Matriz - Vitacura</h3>
            </div>
            
            <ul class="space-y-3.5 text-sm text-slate-600">
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span>Av. Vitacura 4500, Las Condes, Santiago, Chile</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                </svg>
                <div>
                  <span class="block font-semibold text-slate-800">Ventas: +56 2 2345 6789</span>
                  <span class="block text-slate-400 text-xs">Soporte técnico: +56 2 2345 6780</span>
                </div>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L22 8m-2 11a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2h12a2 2 0 012 2v11z"/>
                </svg>
                <span>contacto&#64;concesionariapremium.com</span>
              </li>
              <li class="flex items-start gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <span class="block"><strong class="text-slate-800">Lunes a Viernes:</strong> 9:00 AM - 7:30 PM</span>
                  <span class="block"><strong class="text-slate-800">Sábado:</strong> 10:00 AM - 2:00 PM</span>
                  <span class="block text-slate-400">Domingos y Feriados cerrado</span>
                </div>
              </li>
            </ul>
          </div>

          <!-- Interactive Iframe Map -->
          <div class="h-72 w-full rounded-2xl overflow-hidden border border-slate-200 shadow-sm relative">
            <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-70.6121%2C-33.4079%2C-70.5721%2C-33.3779&amp;layer=mapnik&amp;marker=-33.3929%2C-70.5921"
                    style="border: 0;"></iframe>
          </div>
        </div>

        <!-- Column 2: Form (7/12 cols) -->
        <div class="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 class="font-heading text-xl font-bold text-slate-900 mb-2">Envíanos un Mensaje</h2>
          <p class="text-xs text-slate-500 mb-6">Completa nuestro formulario de contacto formal y un asesor comercial especializado te contactará en un plazo máximo de 24 horas hábiles.</p>
          
          @if (formEnviado()) {
            <div class="rounded-xl bg-emerald-50 border border-emerald-100 p-6 text-emerald-800 flex gap-3.5 fade-in">
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 class="font-heading font-bold text-base text-slate-900">¡Mensaje Recibido!</h3>
                <p class="text-sm text-slate-600 mt-1">Hemos registrado tu consulta con éxito. Se ha enviado una copia de confirmación a tu correo electrónico.</p>
                <button (click)="resetForm()" class="mt-4 text-xs font-bold text-blue-600 hover:text-blue-500">
                  Enviar otro mensaje
                </button>
              </div>
            </div>
          } @else {
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-5">
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre Completo</label>
                  <input type="text" formControlName="nombre" 
                         class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
                         [class.border-red-400]="isFieldInvalid('nombre')" />
                  @if (isFieldInvalid('nombre')) {
                    <span class="text-[10px] text-red-500 mt-1 block">El nombre es requerido.</span>
                  }
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Email</label>
                  <input type="email" formControlName="email" 
                         class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
                         [class.border-red-400]="isFieldInvalid('email')" />
                  @if (isFieldInvalid('email')) {
                    <span class="text-[10px] text-red-500 mt-1 block">Ingresa un email electrónico válido.</span>
                  }
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Teléfono Móvil</label>
                  <input type="tel" formControlName="telefono" 
                         class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
                         [class.border-red-400]="isFieldInvalid('telefono')" />
                  @if (isFieldInvalid('telefono')) {
                    <span class="text-[10px] text-red-500 mt-1 block">El teléfono es requerido.</span>
                  }
                </div>
                <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Asunto de Consulta</label>
                  <select formControlName="asunto" 
                          class="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
                    <option value="ventas">Cotización y Ventas</option>
                    <option value="financiamiento">Planes de Financiamiento</option>
                    <option value="servicio">Servicio Técnico y Repuestos</option>
                    <option value="otro">Otro Asunto</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Mensaje detallado</label>
                <textarea formControlName="mensaje" rows="5" 
                          class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none transition-colors"
                          [class.border-red-400]="isFieldInvalid('mensaje')"
                          placeholder="Escribe aquí tu consulta..."></textarea>
                @if (isFieldInvalid('mensaje')) {
                  <span class="text-[10px] text-red-500 mt-1 block">El mensaje es requerido y debe tener al menos 15 caracteres.</span>
                }
              </div>

              <button type="submit" [disabled]="contactForm.invalid"
                      class="w-full rounded-xl bg-blue-600 px-5 py-4 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors">
                Enviar Formulario de Contacto
              </button>
            </form>
          }
        </div>

      </div>

    </div>
  `
})
export class ContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly quoteService = inject(QuoteService);
  
  protected readonly contactForm: FormGroup;
  protected readonly formEnviado = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      asunto: ['ventas', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(15)]]
    });
  }

  protected async onSubmit(): Promise<void> {
    if (this.contactForm.valid) {
      const success = await this.quoteService.submitQuote({
        nombre: this.contactForm.value.nombre,
        email: this.contactForm.value.email,
        telefono: this.contactForm.value.telefono,
        mensaje: `[Asunto: ${this.contactForm.value.asunto}] ${this.contactForm.value.mensaje}`
      });
      if (success) {
        this.formEnviado.set(true);
      }
    }
  }

  protected resetForm(): void {
    this.contactForm.reset({ asunto: 'ventas' });
    this.formEnviado.set(false);
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
