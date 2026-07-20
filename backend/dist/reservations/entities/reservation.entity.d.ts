import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';
export declare class Reservation {
    id: string;
    userId: string;
    vehicleId: string;
    fechaReserva: string;
    montoReservado: number;
    metodoPago: string;
    estado: 'pendiente' | 'confirmada' | 'cancelada';
    user: User;
    vehicle: Vehicle;
}
