import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center fade-in">
      <div class="w-full max-w-md bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm">
        
        <!-- Header Toggle tabs -->
        <div class="flex border-b border-slate-100 pb-4">
          <button (click)="setMode(true)" 
                  class="w-1/2 text-center pb-2.5 font-heading text-base font-bold transition-all border-b-2 focus:outline-none"
                  [class.border-blue-600]="isLoginMode()"
                  [class.text-blue-600]="isLoginMode()"
                  [class.border-transparent]="!isLoginMode()"
                  [class.text-slate-400]="!isLoginMode()">
            Iniciar Sesión
          </button>
          <button (click)="setMode(false)" 
                  class="w-1/2 text-center pb-2.5 font-heading text-base font-bold transition-all border-b-2 focus:outline-none"
                  [class.border-blue-600]="!isLoginMode()"
                  [class.text-blue-600]="!isLoginMode()"
                  [class.border-transparent]="isLoginMode()"
                  [class.text-slate-400]="isLoginMode()">
            Registrarse
          </button>
        </div>

        <!-- Alert Error -->
        @if (errorMessage()) {
          <div class="mt-4 rounded-lg bg-rose-50 border border-rose-100 p-3 text-rose-800 text-xs flex gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4.5 w-4.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <!-- Forms Area -->
        @if (isLoginMode()) {
          
          <!-- LOGIN FORM -->
          <form [formGroup]="loginForm" (ngSubmit)="onLoginSubmit()" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Correo Electrónico</label>
              <input type="email" formControlName="email" 
                     class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none" />
            </div>
            
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Contraseña</label>
              <input type="password" formControlName="contrasenia" 
                     class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none" />
            </div>

            <button type="submit" [disabled]="loginForm.invalid"
                    class="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors">
              Ingresar a la Plataforma
            </button>
          </form>

          <!-- Accounts Info Box (Only for Demo) -->
          <!-- <div class="mt-8 border border-slate-100 rounded-xl p-4 bg-slate-50 space-y-2 text-[11px] text-slate-500 leading-relaxed">
            <p class="font-bold text-slate-700">Cuentas de demostración predefinidas:</p>
            <div>
              <span class="block"><strong class="text-slate-600">Administrador:</strong> 'admin&#64;concesionaria.com' / admin123</span>
              <span class="block"><strong class="text-slate-600">Cliente estándar:</strong> cliente&#64;concesionaria.com / cliente123</span>
            </div>
            <p class="text-[10px] text-slate-400 border-t border-slate-200/60 pt-1.5">Cualquier otra cuenta con clave de +6 caracteres iniciará sesión automáticamente como cliente.</p>
          </div> -->

        } @else {
          
          <!-- REGISTER FORM -->
          <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre Completo</label>
              <input type="text" formControlName="nombre" 
                     class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Correo Electrónico</label>
              <input type="email" formControlName="email" 
                     class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none" />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Contraseña (Mín. 6 caracteres)</label>
              <input type="password" formControlName="contrasenia" 
                     class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none" />
            </div>

            <button type="submit" [disabled]="registerForm.invalid"
                    class="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-bold text-white shadow-md hover:bg-blue-500 disabled:opacity-50 transition-colors">
              Crear Cuenta Nueva
            </button>
          </form>
          
        }

      </div>
    </div>
  `
})
export class AuthComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly isLoginMode = signal(true);
  protected readonly errorMessage = signal<string>('');

  protected readonly loginForm: FormGroup;
  protected readonly registerForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contrasenia: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  protected setMode(login: boolean): void {
    this.isLoginMode.set(login);
    this.errorMessage.set('');
    this.loginForm.reset();
    this.registerForm.reset();
  }

  protected async onLoginSubmit(): Promise<void> {
    if (this.loginForm.valid) {
      const { email, contrasenia } = this.loginForm.value;
      const success = await this.authService.login(email, contrasenia);
      if (success) {
        this.errorMessage.set('');
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigate(['/']);
        }
      } else {
        this.errorMessage.set('Credenciales inválidas. Por favor intenta de nuevo.');
      }
    }
  }

  protected async onRegisterSubmit(): Promise<void> {
    if (this.registerForm.valid) {
      const { nombre, email, contrasenia } = this.registerForm.value;
      const success = await this.authService.register(nombre, email, contrasenia);
      if (success) {
        this.errorMessage.set('');
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set('Error en el registro. Verifica los datos ingresados.');
      }
    }
  }
}
