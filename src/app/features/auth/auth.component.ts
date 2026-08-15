import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

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
 
        } @else {
          
          <!-- REGISTER FORM -->
          <form [formGroup]="registerForm" (ngSubmit)="onRegisterSubmit()" class="mt-6 space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Nombre Completo o Empresa</label>
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

            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Tipo de Cuenta</label>
              <select formControlName="rol" 
                      class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
                <option value="agente">Agente de Ventas</option>
                <option value="concesionaria">Concesionaria (Empresa)</option>
              </select>
            </div>

            @if (registerForm.get('rol')?.value === 'agente') {
              <div>
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Seleccionar Concesionaria</label>
                <select formControlName="concesionariaId" 
                        class="mt-1.5 w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 focus:border-blue-500 focus:outline-none">
                  <option value="" disabled selected>Seleccione una concesionaria...</option>
                  @for (c of concesionariasList(); track c.id) {
                    <option [value]="c.id">{{ c.nombre }}</option>
                  }
                </select>
                @if (concesionariasList().length === 0) {
                  <p class="text-[10px] text-amber-600 mt-1 font-semibold leading-normal">
                    ⚠️ No hay concesionarias registradas. Registre una cuenta de Concesionaria primero.
                  </p>
                }
                @if (registerForm.get('concesionariaId')?.touched && registerForm.errors?.['concesionariaRequired']) {
                  <p class="text-xs text-rose-500 mt-1 font-semibold">Debes seleccionar una concesionaria para continuar.</p>
                }
              </div>
            }
 
            <div>
              <label class="block text-xs font-bold text-slate-500 uppercase tracking-wide">Monedas que Aceptas para Recibir Pagos</label>
              <div class="mt-2 flex gap-4">
                <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" formControlName="recibeDolares" class="h-4 w-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                  <span>Dólares (USD)</span>
                </label>
                <label class="flex items-center gap-2 text-sm text-slate-700 cursor-pointer select-none">
                  <input type="checkbox" formControlName="recibeBolivianos" class="h-4 w-4 rounded border-slate-200 text-blue-600 focus:ring-blue-500" />
                  <span>Bolivianos (BOB)</span>
                </label>
              </div>
              @if (registerForm.errors?.['noCurrencySelected']) {
                <p class="text-xs text-rose-500 mt-1 font-semibold">Debes seleccionar al menos una moneda para recibir pagos.</p>
              }
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
export class AuthComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
 
  protected readonly isLoginMode = signal(true);
  protected readonly errorMessage = signal<string>('');
  protected readonly concesionariasList = signal<User[]>([]);
 
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
      contrasenia: ['', [Validators.required, Validators.minLength(6)]],
      rol: ['agente', [Validators.required]],
      concesionariaId: [''],
      recibeDolares: [true],
      recibeBolivianos: [true]
    }, { validators: [this.currencySelectionValidator, this.concesionariaRequiredValidator] });
  }

  public ngOnInit(): void {
    this.loadConcesionarias();
  }

  private async loadConcesionarias(): Promise<void> {
    const list = await this.authService.getConcesionarias();
    this.concesionariasList.set(list);
  }
 
  private currencySelectionValidator(group: FormGroup): any {
    const usd = group.get('recibeDolares')?.value;
    const bob = group.get('recibeBolivianos')?.value;
    return (usd || bob) ? null : { noCurrencySelected: true };
  }

  private concesionariaRequiredValidator(group: FormGroup): any {
    const rol = group.get('rol')?.value;
    const concesionariaId = group.get('concesionariaId')?.value;
    if (rol === 'agente' && !concesionariaId) {
      return { concesionariaRequired: true };
    }
    return null;
  }
 
  protected setMode(login: boolean): void {
    this.isLoginMode.set(login);
    this.errorMessage.set('');
    this.loginForm.reset();
    this.registerForm.reset();
    if (!login) {
      this.loadConcesionarias();
    }
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
      const { nombre, email, contrasenia, rol, concesionariaId, recibeDolares, recibeBolivianos } = this.registerForm.value;
      const success = await this.authService.register(nombre, email, contrasenia, rol, rol === 'agente' ? concesionariaId : null, recibeDolares, recibeBolivianos);
      if (success) {
        this.errorMessage.set('');
        this.router.navigate(['/']);
      } else {
        this.errorMessage.set('Error en el registro. Verifica los datos ingresados o el correo ya registrado.');
      }
    }
  }
}
