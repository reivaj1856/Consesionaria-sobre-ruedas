import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/auth';
  private readonly sessionKey = 'concesionaria_session';
  private readonly tokenKey = 'concesionaria_token';
  
  private readonly currentUserSignal = signal<User | null>(null);
  public readonly currentUser = this.currentUserSignal.asReadonly();

  constructor() {
    this.checkSession();
  }

  private async checkSession(): Promise<void> {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      const storedUser = localStorage.getItem(this.sessionKey);
      
      if (token && storedUser) {
        try {
          this.currentUserSignal.set(JSON.parse(storedUser));
          const freshUser = await firstValueFrom(this.http.get<User>(`${this.apiUrl}/me`));
          this.currentUserSignal.set(freshUser);
          localStorage.setItem(this.sessionKey, JSON.stringify(freshUser));
        } catch (e) {
          console.error('Error al restaurar sesión activa:', e);
          this.logout();
        }
      }
    }
  }

  public async login(email: string, contrasenia: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; user: User }>(`${this.apiUrl}/login`, { email, contrasenia })
      );

      if (response && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.sessionKey, JSON.stringify(response.user));
        }
        this.currentUserSignal.set(response.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error en login:', err);
      return false;
    }
  }

  public async register(nombre: string, email: string, contrasenia: string): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ token: string; user: User }>(`${this.apiUrl}/register`, { nombre, email, contrasenia })
      );

      if (response && response.token) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.tokenKey, response.token);
          localStorage.setItem(this.sessionKey, JSON.stringify(response.user));
        }
        this.currentUserSignal.set(response.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error en registro:', err);
      return false;
    }
  }

  public async subscribe(plan: 'gratis' | 'negocio' | 'empresa'): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; user: User }>(`${this.apiUrl}/subscribe`, { plan })
      );
      if (response && response.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.sessionKey, JSON.stringify(response.user));
        }
        this.currentUserSignal.set(response.user);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Error al suscribirse:', err);
      return false;
    }
  }

  public async getUsers(): Promise<User[]> {
    try {
      return await firstValueFrom(this.http.get<User[]>(`${this.apiUrl}/users`));
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      return [];
    }
  }

  public async updateUserPlan(userId: string, plan: 'gratis' | 'negocio' | 'empresa'): Promise<boolean> {
    try {
      const response = await firstValueFrom(
        this.http.patch<{ success: boolean }>(`${this.apiUrl}/users/${userId}/plan`, { plan })
      );
      return response && response.success;
    } catch (err) {
      console.error('Error al actualizar plan del usuario:', err);
      return false;
    }
  }

  public logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.sessionKey);
    }
    this.currentUserSignal.set(null);
  }

  public isLoggedIn(): boolean {
    return this.currentUser() !== null;
  }

  public isAdmin(): boolean {
    const user = this.currentUser();
    return user !== null && user.rol === 'admin';
  }
}
