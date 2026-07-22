import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarouselService } from '../../../core/services/carousel.service';
import { CarouselSlide } from '../../../core/models/carousel.model';

@Component({
  selector: 'app-carousel-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 fade-in">
      
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <span class="text-xs font-bold uppercase tracking-widest text-blue-600">Administración</span>
          <h1 class="font-heading text-3xl font-extrabold text-slate-900 mt-1">Portadas del Carrusel</h1>
          <p class="text-xs text-slate-500 mt-1">Crea, edita o elimina las diapositivas de la página principal. Las imágenes se guardan directamente en la base de datos.</p>
        </div>
        <div class="flex gap-2">
          <button (click)="openCreateModal()" 
                  class="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500 transition-colors">
            + Nueva Portada
          </button>
          <a routerLink="/admin" class="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Volver al Panel
          </a>
        </div>
      </div>

      <!-- Slides Grid -->
      @if (loading()) {
        <div class="py-12 flex justify-center">
          <span class="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full"></span>
        </div>
      } @else {
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (slide of slides(); track slide.id) {
            <div class="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <!-- Image Preview -->
                <div class="h-44 w-full bg-slate-900 relative">
                  <img [src]="slide.image" class="h-full w-full object-cover" [alt]="slide.title" />
                  <span class="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow">
                    {{ slide.badge }}
                  </span>
                  <span class="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-full capitalize">
                    Alineación: {{ slide.alineacion || 'izquierda' }}
                  </span>
                </div>
                
                <!-- Content -->
                <div class="p-6">
                  <h3 class="font-heading text-lg font-bold text-slate-900 line-clamp-1">{{ slide.title }}</h3>
                  <p class="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{{ slide.description }}</p>
                  <div class="mt-4 text-[10px] text-slate-400 font-mono truncate">
                    Enlace: {{ slide.link }}
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="px-6 pb-6 pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <button (click)="openEditModal(slide)" 
                        class="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800 dark:hover:text-white transition-colors">
                  Editar
                </button>
                <button (click)="deleteSlide(slide.id)" 
                        class="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50/50 hover:border-red-200 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-red-400 dark:hover:bg-red-950/20 dark:hover:border-red-900/50 transition-colors">
                  Eliminar
                </button>
              </div>
            </div>
          } @empty {
            <div class="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 class="mt-4 text-sm font-bold text-slate-900">No hay portadas en el carrusel</h3>
              <p class="mt-1 text-xs text-slate-500">Crea una nueva portada para mostrar contenido en la página de inicio.</p>
              <button (click)="openCreateModal()" class="mt-4 inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-500">
                + Crear Portada
              </button>
            </div>
          }
        </div>
      }

      <!-- MODAL: Slide Form -->
      @if (isModalOpen()) {
        <div class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div class="w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl relative">
            <button (click)="closeModal()" class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 class="font-heading text-xl font-bold text-slate-900">
              {{ isEditMode() ? 'Editar Portada' : 'Nueva Portada' }}
            </h3>
            
            <form (ngSubmit)="saveSlide()" class="mt-6 space-y-4">
              <!-- Image Upload -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Imagen de Portada</label>
                
                @if (imagePreview()) {
                  <div class="mt-2 h-40 w-full rounded-xl overflow-hidden relative border border-slate-200 bg-slate-900">
                    <img [src]="imagePreview()" class="h-full w-full object-cover" />
                    <button type="button" (click)="removeImage()" 
                            class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1.5 shadow hover:bg-red-500 transition-colors focus:outline-none">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                } @else {
                  <div class="mt-2 border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-blue-500 transition-colors cursor-pointer relative bg-slate-50/50">
                    <input type="file" (change)="onFileSelected($event)" accept="image/*"
                           class="absolute inset-0 opacity-0 cursor-pointer" />
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-xs text-slate-500 block mt-2 font-medium">Sube una imagen local (Base64)</span>
                  </div>
                }
              </div>

              <!-- Alineación del Contenido -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Alineación del Contenido (Texto)</label>
                <div class="mt-1.5 grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
                  <button type="button" (click)="slideForm.alineacion = 'izquierda'"
                          [class]="slideForm.alineacion === 'izquierda' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900 font-semibold'"
                          class="py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h10M4 18h14" />
                    </svg>
                    Izquierda
                  </button>
                  
                  <button type="button" (click)="slideForm.alineacion = 'centro'"
                          [class]="slideForm.alineacion === 'centro' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900 font-semibold'"
                          class="py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M7 12h10M5 18h14" />
                    </svg>
                    Centro
                  </button>

                  <button type="button" (click)="slideForm.alineacion = 'derecho'"
                          [class]="slideForm.alineacion === 'derecho' ? 'bg-white text-blue-600 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900 font-semibold'"
                          class="py-2 text-xs rounded-lg transition-all flex items-center justify-center gap-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M10 12h10M6 18h14" />
                    </svg>
                    Derecha
                  </button>
                </div>
              </div>

              <!-- Badge / Etiqueta -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Etiqueta de Portada (Badge)</label>
                <input type="text" [(ngModel)]="slideForm.badge" name="badge" required placeholder="Ej. Lanzamiento Exclusivo"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <!-- Title / Título -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Título Principal</label>
                <input type="text" [(ngModel)]="slideForm.title" name="title" required placeholder="Ej. Nuevo Taycan E-Sport"
                       class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <!-- Description / Descripción -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Descripción Corta</label>
                <textarea [(ngModel)]="slideForm.description" name="description" rows="3" required placeholder="Describe las ventajas de esta portada..."
                          class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"></textarea>
              </div>

              <!-- Link / Enlace -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Enlace de Botón (URL o Ruta)</label>
                <input type="text" [(ngModel)]="slideForm.link" name="link" required placeholder="Ej. /catalogo o https://wa.me/..."
                       class="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <!-- Actions -->
              <div class="flex gap-3 pt-4">
                <button type="submit" [disabled]="saving()"
                        class="flex-1 rounded-xl bg-blue-600 text-white py-3 text-sm font-bold shadow-md hover:bg-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  @if (saving()) {
                    <span class="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                    Guardando...
                  } @else {
                    Guardar Cambios
                  }
                </button>
                <button type="button" (click)="closeModal()" class="flex-1 rounded-xl bg-slate-100 text-slate-700 py-3 text-sm font-semibold hover:bg-slate-200 transition-colors">
                  Cancelar
                </button>
              </div>
            </form>

          </div>
        </div>
      }

    </div>
  `
})
export class CarouselAdminComponent implements OnInit {
  private readonly carouselService = inject(CarouselService);

  protected readonly slides = signal<CarouselSlide[]>([]);
  protected readonly loading = signal(true);
  protected readonly saving = signal(false);

  // Modal & Form State
  protected readonly isModalOpen = signal(false);
  protected readonly isEditMode = signal(false);
  protected selectedSlideId: number | null = null;

  protected slideForm = {
    image: '',
    badge: '',
    title: '',
    description: '',
    link: '',
    alineacion: 'izquierda' as 'izquierda' | 'centro' | 'derecho'
  };

  protected readonly imagePreview = signal<string>('');

  public ngOnInit(): void {
    this.fetchSlides();
  }

  private async fetchSlides(): Promise<void> {
    this.loading.set(true);
    const data = await this.carouselService.getSlides();
    this.slides.set(data);
    this.loading.set(false);
  }

  protected openCreateModal(): void {
    this.isEditMode.set(false);
    this.selectedSlideId = null;
    this.slideForm = {
      image: '',
      badge: '',
      title: '',
      description: '',
      link: '/catalogo',
      alineacion: 'izquierda'
    };
    this.imagePreview.set('');
    this.isModalOpen.set(true);
  }

  protected openEditModal(slide: CarouselSlide): void {
    this.isEditMode.set(true);
    this.selectedSlideId = slide.id;
    this.slideForm = {
      image: slide.image,
      badge: slide.badge,
      title: slide.title,
      description: slide.description,
      link: slide.link,
      alineacion: slide.alineacion || 'izquierda'
    };
    this.imagePreview.set(slide.image);
    this.isModalOpen.set(true);
  }

  protected closeModal(): void {
    this.isModalOpen.set(false);
  }

  protected removeImage(): void {
    this.imagePreview.set('');
    this.slideForm.image = '';
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64 = reader.result as string;
        this.imagePreview.set(base64);
        this.slideForm.image = base64;
      };
      
      reader.readAsDataURL(file);
    }
  }

  protected async saveSlide(): Promise<void> {
    const form = this.slideForm;
    if (!form.image || !form.badge || !form.title || !form.description || !form.link) {
      alert('Por favor rellena todos los campos e incluye una imagen.');
      return;
    }

    this.saving.set(true);
    let result;

    if (this.isEditMode() && this.selectedSlideId !== null) {
      result = await this.carouselService.updateSlide(this.selectedSlideId, form);
    } else {
      result = await this.carouselService.createSlide(form);
    }

    this.saving.set(false);

    if (result) {
      this.closeModal();
      await this.fetchSlides();
    } else {
      alert('Hubo un error al guardar la portada.');
    }
  }

  protected async deleteSlide(id: number): Promise<void> {
    if (confirm('¿Estás seguro de que deseas eliminar permanentemente esta portada?')) {
      const success = await this.carouselService.deleteSlide(id);
      if (success) {
        await this.fetchSlides();
      } else {
        alert('No se pudo eliminar la portada.');
      }
    }
  }
}
