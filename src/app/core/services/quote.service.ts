import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ContactRequest } from '../models/reservation.model';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = '/api/quotes';

  public async submitQuote(quote: ContactRequest): Promise<boolean> {
    try {
      await firstValueFrom(this.http.post<any>(this.apiUrl, quote));
      return true;
    } catch (err) {
      console.error('Error al enviar cotización:', err);
      return false;
    }
  }
}
