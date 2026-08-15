import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Vehicle } from '../models/vehicle.model';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/vehicles';

  private readonly vehiclesSignal = signal<Vehicle[]>([]);
  public readonly vehicles = this.vehiclesSignal.asReadonly();

  constructor() {
    this.initVehicles();
  }

  private async initVehicles(): Promise<void> {
    await this.refreshVehicles();
  }

  public async refreshVehicles(): Promise<void> {
    try {
      const data = await firstValueFrom(this.http.get<Vehicle[]>(this.apiUrl));
      this.vehiclesSignal.set(data);
    } catch (err) {
      console.error('Error al cargar vehículos desde la API:', err);
    }
  }

  public getVehicles(): Vehicle[] {
    return this.vehicles();
  }

  public async getVehicleById(id: string): Promise<Vehicle | undefined> {
    try {
      return await firstValueFrom(this.http.get<Vehicle>(`${this.apiUrl}/${id}`));
    } catch (err) {
      console.error('Error al obtener vehículo:', err);
      return undefined;
    }
  }

  public async getMyListings(): Promise<Vehicle[]> {
    try {
      return await firstValueFrom(this.http.get<Vehicle[]>(`${this.apiUrl}/my-listings`));
    } catch (err) {
      console.error('Error al obtener mis publicaciones:', err);
      return [];
    }
  }

  public async createVehicle(vehicle: Omit<Vehicle, 'id' | 'fechaIngreso'>): Promise<void> {
    try {
      await firstValueFrom(this.http.post<Vehicle>(this.apiUrl, vehicle));
      await this.refreshVehicles();
    } catch (err) {
      console.error('Error al crear vehículo:', err);
    }
  }

  public async updateVehicle(id: string, vehicle: Partial<Vehicle>): Promise<boolean> {
    try {
      await firstValueFrom(this.http.patch<Vehicle>(`${this.apiUrl}/${id}`, vehicle));
      await this.refreshVehicles();
      return true;
    } catch (err) {
      console.error('Error al actualizar vehículo:', err);
      return false;
    }
  }

  public async deleteVehicle(id: string): Promise<void> {
    try {
      await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
      await this.refreshVehicles();
    } catch (err) {
      console.error('Error al eliminar vehículo:', err);
    }
  }
}
