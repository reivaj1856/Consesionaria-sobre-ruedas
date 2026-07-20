import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { VehiclesService } from '../vehicles/vehicles.service';
export declare class ReservationsService {
    private readonly reservationRepository;
    private readonly vehiclesService;
    constructor(reservationRepository: Repository<Reservation>, vehiclesService: VehiclesService);
    create(createReservationDto: CreateReservationDto, userId: string): Promise<Reservation>;
    findAll(): Promise<Reservation[]>;
    findByUserId(userId: string): Promise<Reservation[]>;
    updateStatus(id: string, status: 'pendiente' | 'confirmada' | 'cancelada'): Promise<Reservation>;
}
