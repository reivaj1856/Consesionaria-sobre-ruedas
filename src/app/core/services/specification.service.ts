import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Specification, SpecificationGroup } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class SpecificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:3000/api/specifications';

  public async getGroups(): Promise<SpecificationGroup[]> {
    try {
      return await firstValueFrom(this.http.get<SpecificationGroup[]>(`${this.apiUrl}/groups`));
    } catch (err) {
      console.error('Error al obtener grupos de especificaciones:', err);
      return [];
    }
  }

  public async getSpecifications(): Promise<Specification[]> {
    try {
      return await firstValueFrom(this.http.get<Specification[]>(this.apiUrl));
    } catch (err) {
      console.error('Error al obtener especificaciones:', err);
      return [];
    }
  }

  public async createGroup(nombre: string): Promise<SpecificationGroup | null> {
    try {
      return await firstValueFrom(this.http.post<SpecificationGroup>(`${this.apiUrl}/groups`, { nombre }));
    } catch (err) {
      console.error('Error al crear grupo:', err);
      return null;
    }
  }

  public async createSpecification(nombre: string, grupoId: number): Promise<Specification | null> {
    try {
      return await firstValueFrom(this.http.post<Specification>(this.apiUrl, { nombre, grupoId }));
    } catch (err) {
      console.error('Error al crear especificación:', err);
      return null;
    }
  }
}
