import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-slate-900 text-slate-300">
      <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 gap-8 lg:grid-cols-3">
          
          <!-- Brand & Info -->
          <div>
            <div class="flex items-center gap-2">
              <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-heading font-extrabold text-xl shadow-md">
                R
              </div>
              <span class="font-heading text-xl font-bold tracking-tight text-white">
                ruedas<span class="text-blue-500">.store</span>
              </span>
            </div>
            <p class="mt-4 max-w-xs text-sm text-slate-400 leading-relaxed">
              Líderes en venta de autos, motos y maquinaria pesada. Ofrecemos calidad garantizada, financiamiento flexible y la mejor atención del país.
            </p>
            <div class="mt-6 flex gap-4">
              <!-- Social Icons -->
              <a href="#" class="text-slate-400 hover:text-white transition-colors" title="Facebook">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/></svg>
              </a>
              <a href="#" class="text-slate-400 hover:text-white transition-colors" title="Instagram">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" class="text-slate-400 hover:text-white transition-colors" title="Twitter">
                <svg class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
              </a>
            </div>
          </div>

          <!-- Links Grid -->
          <div class="grid grid-cols-2 gap-8 lg:col-span-2 sm:grid-cols-3">
            
            <!-- Categorías -->
            <div>
              <p class="font-heading text-sm font-semibold tracking-wider text-white uppercase">Categorías</p>
              <nav class="mt-4 flex flex-col gap-2.5 text-sm">
                <a routerLink="/catalogo/autos" class="text-slate-400 hover:text-white transition-colors">Autos y Camionetas</a>
                <a routerLink="/catalogo/autos-electricos" class="text-slate-400 hover:text-white transition-colors">Autos Eléctricos</a>
                <a routerLink="/catalogo/motos" class="text-slate-400 hover:text-white transition-colors">Motocicletas</a>
                <a routerLink="/catalogo/motos-electricas" class="text-slate-400 hover:text-white transition-colors">Motos Eléctricas</a>
                <a routerLink="/catalogo/maquinaria-agricola" class="text-slate-400 hover:text-white transition-colors">Maquinaria Agrícola</a>
                <a routerLink="/catalogo/transporte-pesado" class="text-slate-400 hover:text-white transition-colors">Transporte Pesado</a>
              </nav>
            </div>

            <!-- Navegación -->
            <div>
              <p class="font-heading text-sm font-semibold tracking-wider text-white uppercase">Compañía</p>
              <nav class="mt-4 flex flex-col gap-2.5 text-sm">
                <a routerLink="/" class="text-slate-400 hover:text-white transition-colors">Inicio</a>
                <a routerLink="/catalogo" class="text-slate-400 hover:text-white transition-colors">Catálogo Completo</a>
                <a routerLink="/comparador" class="text-slate-400 hover:text-white transition-colors">Comparar Vehículos</a>
                <a routerLink="/contacto" class="text-slate-400 hover:text-white transition-colors">Ubicaciones y Sucursales</a>
              </nav>
            </div>

            <!-- Datos de Sucursal -->
            <div>
              <p class="font-heading text-sm font-semibold tracking-wider text-white uppercase">Contacto & Horarios</p>
              <ul class="mt-4 flex flex-col gap-3 text-sm text-slate-400">
                <li class="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                  <span>Av. Vitacura 4500, Las Condes, Santiago</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                  <span>+56 2 2345 6789</span>
                </li>
                <li class="flex items-start gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                  <div>
                    <span class="block">Lun - Vie: 9:00 - 19:30</span>
                    <span class="block">Sáb: 10:00 - 14:00</span>
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        <!-- Copyright -->
        <div class="mt-12 border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>&copy; 2026 ruedas.store S.A. Todos los derechos reservados.</p>
          <div class="flex gap-6">
            <a href="#" class="hover:text-white transition-colors">Términos de Servicio</a>
            <a href="#" class="hover:text-white transition-colors">Políticas de Privacidad</a>
          </div>
        </div>

      </div>
    </footer>
  `,
  styles: ``
})
export class FooterComponent {}
