export interface ContactRequest {
  nombre: string;
  email: string;
  telefono: string;
  mensaje: string;
  vehicleId?: string;
  fecha?: string;
}

export interface Reservation {
  id: string;
  userId: string;
  vehicleId: string;
  fechaReserva: string;
  montoReservado: number;
  metodoPago: string;
  estado: 'pendiente' | 'confirmada' | 'cancelada';
}
