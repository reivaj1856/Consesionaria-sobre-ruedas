import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Reservation } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/reservations';

  public async createReservation(vehicleId: string, metodoPago: string, montoReservado: number): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.post<Reservation>(this.apiUrl, { vehicleId, metodoPago, montoReservado })
      );
      return true;
    } catch (err) {
      console.error('Error al crear reserva:', err);
      return false;
    }
  }

  public async getMyReservations(): Promise<Reservation[]> {
    try {
      return await firstValueFrom(this.http.get<Reservation[]>(`${this.apiUrl}/my`));
    } catch (err) {
      console.error('Error al obtener reservas del usuario:', err);
      return [];
    }
  }
}
