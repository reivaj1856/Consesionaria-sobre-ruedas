import { Component, inject, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VehicleService } from '../../core/services/vehicle.service';
import { CarouselService } from '../../core/services/carousel.service';
import { VehicleCardComponent } from '../../shared/components/vehicle-card/vehicle-card.component';
import { CarouselSlide } from '../../core/models/carousel.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, FormsModule, VehicleCardComponent, CommonModule],
  styles: [`
    @keyframes featuredSlideRight {
      0% { transform: translateX(120px); opacity: 0; }
      40% { opacity: 1; }
      100% { transform: translateX(0); opacity: 1; }
    }
    .featured-card-animate {
      animation: featuredSlideRight 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
    }
  `],
  template: `
    <div class="fade-in">
      
      <!-- HERO CAROUSEL (Pantalla Completa) -->
      <section class="relative bg-slate-950 text-white overflow-hidden h-[calc(100vh-80px)] min-h-[600px] w-full">
        
        @if (loadingSlides()) {
          <div class="absolute inset-0 flex items-center justify-center bg-slate-950/60 z-30">
            <span class="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full"></span>
          </div>
        }

        <!-- Slides Wrapper -->
        @for (slide of slides(); track slide.id) {
          <div class="absolute inset-0 transition-opacity duration-700 ease-in-out z-0"
               [class.opacity-100]="activeSlide() === $index"
               [class.opacity-0]="activeSlide() !== $index">
            
            <!-- Fotografía de Fondo (Clara y Nítida sin Opacar) -->
            <img [src]="slide.image" class="h-full w-full object-cover" [alt]="slide.title" />
            
            <!-- Degradado Sutil de Fondo (Solo en la base) -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent"></div>
            
            <!-- Slide Content Box (Compacto, Flotante y No Invasivo) -->
            <div class="absolute inset-x-0 bottom-0 z-10 pb-12 sm:pb-14">
              <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full flex"
                   [class.justify-start]="!slide.alineacion || slide.alineacion === 'izquierda'"
                   [class.justify-center]="slide.alineacion === 'centro'"
                   [class.justify-end]="slide.alineacion === 'derecho'">
                
                <div class="max-w-sm sm:max-w-md bg-slate-950/60 backdrop-blur-md border border-white/15 p-5 rounded-lg shadow-xl transition-all duration-500"
                     [class.text-left]="!slide.alineacion || slide.alineacion === 'izquierda'"
                     [class.text-center]="slide.alineacion === 'centro'"
                     [class.text-right]="slide.alineacion === 'derecho'"
                     [class.translate-y-0]="activeSlide() === $index"
                     [class.opacity-100]="activeSlide() === $index"
                     [class.translate-y-3]="activeSlide() !== $index"
                     [class.opacity-0]="activeSlide() !== $index">
                  
                  <!-- Badge -->
                  <div class="flex"
                       [class.justify-start]="!slide.alineacion || slide.alineacion === 'izquierda'"
                       [class.justify-center]="slide.alineacion === 'centro'"
                       [class.justify-end]="slide.alineacion === 'derecho'">
                    <span class="inline-flex items-center gap-1.5 rounded-md bg-gray-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-sm">
                      {{ slide.badge }}
                    </span>
                  </div>

                  <!-- Title -->
                  <h1 class="mt-2 font-heading text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-snug drop-shadow-sm">
                    {{ slide.title }}
                  </h1>

                  <!-- Description -->
                  <p class="mt-1.5 text-xs text-slate-200 leading-relaxed font-normal line-clamp-2">
                    {{ slide.description }}
                  </p>

                </div>
              </div>
            </div>
            
          </div>
        }

        <!-- Carousel Indicators (Navegación minimalista) -->
        @if (slides().length > 1) {
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 p-1 rounded-full bg-slate-950/40 backdrop-blur-sm border border-white/10">
            @for (slide of slides(); track slide.id) {
              <button (click)="setSlide($index)" 
                      class="h-1.5 rounded-full transition-all duration-300 focus:outline-none"
                      [class.w-6]="activeSlide() === $index"
                      [class.bg-blue-500]="activeSlide() === $index"
                      [class.w-2]="activeSlide() !== $index"
                      [class.bg-white/40]="activeSlide() !== $index">
              </button>
            }
          </div>
        }

        <!-- Carousel Navigation Arrows -->
        @if (slides().length > 1) {
          <button (click)="prevSlide()" class="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 backdrop-blur-sm border border-white/10 text-white focus:outline-none hidden sm:flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button (click)="nextSlide()" class="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-xl bg-slate-950/30 hover:bg-slate-950/60 backdrop-blur-sm border border-white/10 text-white focus:outline-none hidden sm:flex items-center justify-center transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        }

      </section>

      <!-- Category Navigation Grid -->
      <section class="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div class="text-center">
          <span class="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-600 ring-1 ring-blue-500/20 uppercase tracking-wider">
            Explora por Categorías
          </span>
          <h2 class="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl mt-3">¿Qué estás buscando hoy?</h2>
          <p class="mt-4 text-slate-600">Explora nuestro stock completo segmentado por tipo de vehículo</p>
        </div>

        <div class="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          
          <!-- Autos -->
          <a routerLink="/catalogo/autos"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-transform hover:-translate-y-1">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Autos" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <h3 class="font-heading text-2xl font-bold">Autos y Camionetas</h3>
              <p class="mt-1 text-xs text-slate-300">Sedanes, SUV, Pick-ups y familiares a combustión.</p>
            </div>
          </a>

          <!-- Autos Eléctricos -->
          <a routerLink="/catalogo/autos-electricos"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-transform hover:-translate-y-1">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Autos Eléctricos" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <h3 class="font-heading text-2xl font-bold flex items-center gap-2">
                Autos Eléctricos
                <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p class="mt-1 text-xs text-slate-300">Vehículos 100% eléctricos, híbridos y sustentables.</p>
            </div>
          </a>

          <!-- Motos -->
          <a routerLink="/catalogo/motos"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-transform hover:-translate-y-1">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Motos" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <h3 class="font-heading text-2xl font-bold">Motocicletas</h3>
              <p class="mt-1 text-xs text-slate-300">Deportivas, Chopper, Adventure y de calle.</p>
            </div>
          </a>

          <!-- Motos Eléctricas -->
          <a routerLink="/catalogo/motos-electricas"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-transform hover:-translate-y-1">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1599819811279-d5ad9cccf838?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Motos Eléctricas" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <h3 class="font-heading text-2xl font-bold flex items-center gap-2">
                Motos Eléctricas
                <span class="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </h3>
              <p class="mt-1 text-xs text-slate-300">Scooters urbanos y motos de alto rendimiento eléctrico.</p>
            </div>
          </a>

          <!-- Maquinaria Agrícola -->
          <a routerLink="/catalogo/maquinaria-agricola"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-transform hover:-translate-y-1">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Maquinaria Agrícola" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <h3 class="font-heading text-2xl font-bold">Maquinaria Agrícola</h3>
              <p class="mt-1 text-xs text-slate-300">Tractores, cosechadoras y herramientas de campo.</p>
            </div>
          </a>

          <!-- Transporte Pesado -->
          <a routerLink="/catalogo/transporte-pesado"
             class="group relative flex h-72 flex-col justify-end overflow-hidden rounded-3xl bg-slate-900 p-6 shadow-md transition-transform hover:-translate-y-1">
            <div class="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=600" 
                   class="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" alt="Categoría Transporte Pesado" />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
            </div>
            <div class="relative z-10 text-white">
              <h3 class="font-heading text-2xl font-bold">Transporte Pesado</h3>
              <p class="mt-1 text-xs text-slate-300">Camiones, volquetas y maquinaria pesada industrial.</p>
            </div>
          </a>

        </div>
      </section>

      <!-- Featured Vehicles Slideshow Carousel -->
      <section class="bg-slate-100 py-16">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex flex-col sm:flex-row items-start sm:items-end justify-between border-b border-slate-200/50 pb-5">
            <div>
              <span class="inline-flex items-center gap-1 rounded-full bg-blue-600/10 px-3 py-1 text-xs font-bold text-blue-600 uppercase tracking-wider">
                Modelos Recomendados
              </span>
              <h2 class="font-heading text-3xl font-bold tracking-tight text-slate-900 mt-2">Vehículos Destacados</h2>
              <p class="mt-2 text-slate-600">Nuestras recomendaciones exclusivas para ti esta semana</p>
            </div>
            <a routerLink="/catalogo" class="mt-4 sm:mt-0 inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-500 font-bold">
              Ver catálogo completo
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          <!-- Slideshow Carousel Container (4 vehicles side-by-side) -->
          <div class="mt-10 relative flex justify-center items-center w-full px-6 md:px-10 overflow-hidden">
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full max-w-7xl mx-auto">
              @for (item of visibleFeaturedVehicles(); track item.trackKey) {
                <div class="w-full transform hover:-translate-y-1 transition-transform duration-300 featured-card-animate"
                     [style.animation-delay]="($index * 0.12) + 's'"
                     [class.hidden]="$index > 0"
                     [class.sm:block]="$index === 1"
                     [class.lg:block]="$index >= 2">
                  <app-vehicle-card [vehicle]="item.vehicle"></app-vehicle-card>
                </div>
              } @empty {
                <div class="col-span-full py-12 text-center text-slate-500">
                  Cargando recomendaciones premium...
                </div>
              }
            </div>

            <!-- Navigation Buttons (Prev / Next) -->
            @if (featuredVehicles().length > 4) {
              <button (click)="prevFeaturedSlide()" 
                      class="absolute left-[-20px] sm:left-[-10px] md:left-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 focus:outline-none flex items-center justify-center transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button (click)="nextFeaturedSlide()" 
                      class="absolute right-[-20px] sm:right-[-10px] md:right-0 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 hover:bg-slate-50 focus:outline-none flex items-center justify-center transition-all cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            }

          </div>

          <!-- Carousel Dots Indicators -->
          @if (featuredVehicles().length > 4) {
            <div class="mt-8 flex justify-center gap-2">
              @for (vehicle of featuredVehicles(); track vehicle.id) {
                <button (click)="setFeaturedSlide($index)" 
                        class="h-2 rounded-full transition-all duration-300 focus:outline-none cursor-pointer"
                        [class.w-6]="activeFeaturedSlide() === $index"
                        [class.bg-blue-600]="activeFeaturedSlide() === $index"
                        [class.w-2]="activeFeaturedSlide() !== $index"
                        [class.bg-slate-300]="activeFeaturedSlide() !== $index">
                </button>
              }
            </div>
          }

        </div>
      </section>
    </div>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  private readonly vehicleService = inject(VehicleService);
  private readonly carouselService = inject(CarouselService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  // Carousel Signals
  protected readonly slides = signal<CarouselSlide[]>([]);
  protected readonly activeSlide = signal(0);
  protected readonly loadingSlides = signal(true);
  private carouselIntervalId: any = null;

  // Featured Vehicles Carousel Signals
  protected readonly activeFeaturedSlide = signal(0);
  private featuredIntervalId: any = null;

  // Featured Vehicles
  protected readonly featuredVehicles = computed(() =>
    this.vehicleService.vehicles().filter(v => v.destacado)
  );

  protected readonly visibleFeaturedVehicles = computed(() => {
    const list = this.featuredVehicles();
    if (list.length === 0) return [];

    const index = this.activeFeaturedSlide();
    const count = list.length;

    const items = count <= 4 ? list : [
      list[index % count],
      list[(index + 1) % count],
      list[(index + 2) % count],
      list[(index + 3) % count]
    ];

    // Unique key per rotation so Angular re-creates the DOM elements
    return items.map((v, i) => ({ vehicle: v, trackKey: `${index}-${i}` }));
  });

  protected readonly contactForm: FormGroup;
  protected readonly formEnviado = signal(false);

  constructor() {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      mensaje: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  public async ngOnInit(): Promise<void> {
    await this.loadCarouselData();
    this.startCarousel();
    this.startFeaturedCarousel();
  }

  public ngOnDestroy(): void {
    this.stopCarousel();
    this.stopFeaturedCarousel();
  }

  private async loadCarouselData(): Promise<void> {
    this.loadingSlides.set(true);
    try {
      const data = await this.carouselService.getSlides();
      this.slides.set(data);
    } catch (err) {
      console.error('Error al cargar portadas desde la base de datos:', err);
    } finally {
      this.loadingSlides.set(false);
    }
  }

  // Carousel Methods
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
    const prev = current === 0 ? this.slides().length - 1 : current - 1;
    this.activeSlide.set(prev);
    this.stopCarousel();
    this.startCarousel();
  }

  protected nextSlide(): void {
    const current = this.activeSlide();
    if (this.slides().length > 0) {
      const next = current === this.slides().length - 1 ? 0 : current + 1;
      this.activeSlide.set(next);
    }
  }

  // Featured Carousel Slideshow Helper Methods
  private startFeaturedCarousel(): void {
    if (typeof window !== 'undefined') {
      this.featuredIntervalId = setInterval(() => {
        this.nextFeaturedSlide();
      }, 5000);
    }
  }

  private stopFeaturedCarousel(): void {
    if (this.featuredIntervalId) {
      clearInterval(this.featuredIntervalId);
    }
  }

  protected setFeaturedSlide(index: number): void {
    this.activeFeaturedSlide.set(index);
    this.stopFeaturedCarousel();
    this.startFeaturedCarousel();
  }

  protected prevFeaturedSlide(): void {
    const current = this.activeFeaturedSlide();
    const count = this.featuredVehicles().length;
    if (count === 0) return;
    const prev = current === 0 ? count - 1 : current - 1;
    this.activeFeaturedSlide.set(prev);
    this.stopFeaturedCarousel();
    this.startFeaturedCarousel();
  }

  protected nextFeaturedSlide(): void {
    const current = this.activeFeaturedSlide();
    const count = this.featuredVehicles().length;
    if (count === 0) return;
    const next = current === count - 1 ? 0 : current + 1;
    this.activeFeaturedSlide.set(next);
    this.stopFeaturedCarousel();
    this.startFeaturedCarousel();
  }

  // Search Submit
  protected onSearch(event: Event, query: string): void {
    event.preventDefault();
    const cleanQuery = query.trim();
    if (cleanQuery) {
      this.router.navigate(['/catalogo'], { queryParams: { buscar: cleanQuery } });
    } else {
      this.router.navigate(['/catalogo']);
    }
  }

  // Contact Form Submit
  protected onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Mensaje de contacto enviado:', this.contactForm.value);
      this.formEnviado.set(true);
      setTimeout(() => {
        this.contactForm.reset();
        this.formEnviado.set(false);
      }, 5000);
    }
  }

  protected isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }
}
