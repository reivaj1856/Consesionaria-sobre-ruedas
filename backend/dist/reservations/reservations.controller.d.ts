import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
export declare class ReservationsController {
    private readonly reservationsService;
    constructor(reservationsService: ReservationsService);
    create(createReservationDto: CreateReservationDto, req: any): Promise<import("./entities/reservation.entity").Reservation>;
    findMyReservations(req: any): Promise<import("./entities/reservation.entity").Reservation[]>;
    findAll(): Promise<import("./entities/reservation.entity").Reservation[]>;
    updateStatus(id: string, estado: 'pendiente' | 'confirmada' | 'cancelada'): Promise<import("./entities/reservation.entity").Reservation>;
}
