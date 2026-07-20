import { Injectable, signal, computed } from '@angular/core';
import { Vehicle } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private readonly comparedSignal = signal<Vehicle[]>([]);
  public readonly comparedVehicles = this.comparedSignal.asReadonly();
  
  public readonly count = computed(() => this.comparedSignal().length);

  public addVehicle(vehicle: Vehicle): boolean {
    const current = this.comparedSignal();
    
    // Validar si ya está agregado
    if (current.some(v => v.id === vehicle.id)) {
      return false;
    }
    
    // Limitar a máximo 3 vehículos
    if (current.length >= 3) {
      return false;
    }

    this.comparedSignal.set([...current, vehicle]);
    return true;
  }

  public removeVehicle(vehicleId: string): void {
    const current = this.comparedSignal();
    this.comparedSignal.set(current.filter(v => v.id !== vehicleId));
  }

  public toggleComparison(vehicle: Vehicle): boolean {
    const current = this.comparedSignal();
    if (current.some(v => v.id === vehicle.id)) {
      this.removeVehicle(vehicle.id);
      return true;
    } else {
      return this.addVehicle(vehicle);
    }
  }

  public isCompared(vehicleId: string): boolean {
    return this.comparedSignal().some(v => v.id === vehicleId);
  }

  public clear(): void {
    this.comparedSignal.set([]);
  }
}
