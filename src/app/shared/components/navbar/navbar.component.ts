import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { FavoriteService } from '../../../core/services/favorite.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 w-full border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md transition-colors">
      <div class="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2 group">
          <span class="font-heading text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            RUEDAS<span class="text-blue-600 dark:text-blue-400">.STORE</span>
          </span>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <a routerLink="/" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold" [routerLinkActiveOptions]="{exact: true}"
             class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Inicio</a>
          <a routerLink="/catalogo" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Catálogo</a>
          <a routerLink="/comparador" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
            Comparar
            @if (comparisonCount() > 0) {
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">{{ comparisonCount() }}</span>
            }
          </a>
          <a routerLink="/favoritos" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1.5">
            Favoritos
            @if (favoriteCount() > 0) {
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">{{ favoriteCount() }}</span>
            }
          </a>
          <a routerLink="/contacto" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contacto</a>
          <a routerLink="/planes" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
             class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Planes</a>
          @if (authService.currentUser() && !authService.isAdmin()) {
            <a routerLink="/mis-publicaciones" routerLinkActive="text-blue-600 dark:text-blue-400 font-semibold"
               class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Mis Publicaciones</a>
          }
        </nav>

        <!-- Desktop CTA / Dark Mode Toggle / User -->
        <div class="hidden md:flex items-center gap-3">
          
          <!-- Dark / Light Mode Toggle Button -->
          <button (click)="themeService.toggleTheme()" 
                  class="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all focus:outline-none"
                  [attr.aria-label]="themeService.isDarkMode() ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'"
                  [title]="themeService.isDarkMode() ? 'Modo Claro' : 'Modo Oscuro'">
            @if (themeService.isDarkMode()) {
              <!-- Sun Icon -->
                <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                width="20" height="20" viewBox="0 0 512.000000 512.000000"
                preserveAspectRatio="xMidYMid meet">

                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
                fill="#fff" stroke="none">
                <path d="M2520 4813 c-8 -3 -26 -15 -38 -27 -51 -46 -52 -52 -52 -411 0 -373
                2 -388 64 -426 64 -39 147 -14 179 54 15 31 17 78 17 372 0 361 0 364 -53 413
                -25 24 -88 37 -117 25z"/>
                <path d="M3994 4161 c-21 -16 -136 -127 -256 -247 -230 -233 -240 -247 -223
                -323 10 -47 67 -91 117 -91 41 0 46 4 271 228 270 267 287 288 287 350 0 37
                -6 50 -34 78 -46 46 -105 48 -162 5z"/>
                <path d="M994 4161 c-59 -26 -83 -116 -46 -172 15 -23 407 -385 500 -462 25
                -20 44 -27 77 -27 56 0 80 32 80 107 l0 53 -251 251 c-243 243 -253 251 -295
                255 -24 2 -54 0 -65 -5z"/>
                <path d="M2370 3521 c-258 -55 -482 -209 -629 -432 -297 -451 -169 -1046 290
                -1348 452 -298 1046 -169 1350 292 295 448 165 1047 -293 1347 -210 139 -479
                191 -718 141z m294 -246 c145 -14 305 -95 417 -212 116 -121 182 -262 197
                -423 23 -233 -53 -446 -215 -601 -158 -152 -357 -219 -583 -197 -334 32 -606
                304 -638 638 -34 348 163 658 485 766 72 24 202 44 253 38 14 -2 52 -6 84 -9z"/>
                <path d="M375 2671 c-54 -33 -70 -59 -70 -111 0 -38 6 -54 25 -75 51 -55 52
                -55 415 -55 294 0 341 2 372 17 96 45 96 181 0 226 -31 15 -78 17 -374 17
                -312 0 -340 -2 -368 -19z"/>
                <path d="M4001 2673 c-94 -47 -93 -181 2 -226 31 -15 78 -17 372 -17 363 0
                364 0 415 55 20 21 25 37 25 75 0 38 -5 54 -25 75 -51 55 -52 55 -417 55 -295
                0 -342 -3 -372 -17z"/>
                <path d="M1435 1595 c-35 -18 -433 -411 -476 -469 -22 -29 -29 -50 -29 -84 0
                -38 5 -50 39 -83 49 -49 90 -52 147 -10 21 16 139 129 261 252 235 238 245
                252 228 327 -14 66 -105 102 -170 67z"/>
                <path d="M3575 1601 c-56 -23 -80 -101 -51 -163 23 -49 484 -505 519 -513 40
                -10 76 2 114 40 45 45 46 104 4 161 -48 65 -454 462 -484 473 -33 13 -74 13
                -102 2z"/>
                <path d="M2494 1171 c-62 -38 -64 -53 -64 -426 0 -363 0 -364 55 -415 21 -20
                37 -25 75 -25 38 0 54 5 75 25 55 51 55 52 55 415 0 294 -2 341 -17 372 -20
                43 -66 73 -113 73 -19 0 -49 -9 -66 -19z"/>
                </g>
                </svg>
            } @else {
              <!-- Moon Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            }
          </button>

          @if (authService.currentUser()) {
            <!-- Admin Panel access if authorized -->
             @if (authService.isAdmin()) {
               <a routerLink="/admin" class="text-xs font-semibold text-white bg-slate-900 dark:bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-lg hover:bg-slate-800 transition-colors">
                 Panel Admin
               </a>
             } @else {
               <a routerLink="/admin/crear" class="text-xs font-semibold text-white bg-blue-600 px-3.5 py-2 rounded-lg hover:bg-blue-500 transition-colors shadow-sm">
                 Publicar Vehículo
               </a>
             }
             <!-- User menu -->
            <div class="flex items-center gap-3">
              <div class="flex flex-col text-right">
                <span class="text-xs font-semibold text-slate-900 dark:text-white">{{ authService.currentUser()?.nombre }}</span>
                <span class="text-[10px] text-slate-500 dark:text-slate-400 capitalize">{{ authService.currentUser()?.rol }}</span>
              </div>
              <button (click)="logout()" class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-950 transition-all" title="Cerrar Sesión">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          } @else {
            <a routerLink="/autenticacion" class="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-colors">
              Iniciar Sesión
            </a>
          }
        </div>

        <!-- Mobile Controls & Menu Toggle Button -->
        <div class="flex md:hidden items-center gap-2">
          
          <button (click)="themeService.toggleTheme()" 
                  class="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
            @if (themeService.isDarkMode()) {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            } @else {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            }
          </button>

          @if (favoriteCount() > 0) {
            <a routerLink="/favoritos" class="relative p-2 text-slate-500 dark:text-slate-400">
              <span class="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white">{{ favoriteCount() }}</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </a>
          }
          
          <button (click)="toggleMenu()" class="rounded-lg p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              @if (isMenuOpen()) {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              } @else {
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>

      </div>

      <!-- Mobile Menu Panel -->
      @if (isMenuOpen()) {
        <div class="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 md:hidden space-y-3">
          <a routerLink="/" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Inicio</a>
          <a routerLink="/catalogo" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Catálogo</a>
          <a routerLink="/comparador" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Comparar ({{ comparisonCount() }})</a>
          <a routerLink="/favoritos" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Favoritos ({{ favoriteCount() }})</a>
          <a routerLink="/contacto" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Contacto</a>
          <a routerLink="/planes" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Planes de Precios</a>
          @if (authService.currentUser() && !authService.isAdmin()) {
            <a routerLink="/mis-publicaciones" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900">Mis Publicaciones</a>
            <a routerLink="/admin/crear" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-white bg-blue-600 text-center hover:bg-blue-500">Publicar Vehículo</a>
          }
          <hr class="border-slate-100 dark:border-slate-800">
          @if (authService.currentUser()) {
            @if (authService.isAdmin()) {
              <a routerLink="/admin" (click)="closeMenu()" class="block rounded-lg px-3 py-2 text-base font-medium text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900 hover:bg-slate-100">Panel Admin</a>
            }
            <div class="flex items-center justify-between px-3 py-2">
              <div>
                <div class="text-sm font-semibold text-slate-900 dark:text-white">{{ authService.currentUser()?.nombre }}</div>
                <div class="text-xs text-slate-500 dark:text-slate-400">{{ authService.currentUser()?.email }}</div>
              </div>
              <button (click)="logout()" class="text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/50 px-3 py-1.5 rounded-lg">Cerrar Sesión</button>
            </div>
          } @else {
            <a routerLink="/autenticacion" (click)="closeMenu()" class="block text-center rounded-lg bg-blue-600 px-4 py-2.5 text-base font-semibold text-white shadow-sm hover:bg-blue-500">
              Iniciar Sesión
            </a>
          }
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  private readonly favoriteService = inject(FavoriteService);
  private readonly comparisonService = inject(ComparisonService);
  private readonly router = inject(Router);

  protected readonly isMenuOpen = signal(false);
  protected readonly favoriteCount = this.favoriteService.favoritesCount;
  protected readonly comparisonCount = this.comparisonService.count;

  protected toggleMenu(): void {
    this.isMenuOpen.update(v => !v);
  }

  protected closeMenu(): void {
    this.isMenuOpen.set(false);
  }

  protected logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.router.navigate(['/']);
  }
}
