import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async create(createReservationDto: CreateReservationDto, userId: string) {
    const { vehicleId, metodoPago, montoReservado } = createReservationDto;

    const vehicle = await this.vehiclesService.findOne(vehicleId);
    if (vehicle.estado !== 'disponible') {
      throw new BadRequestException('El vehículo no está disponible para reserva.');
    }

    await this.vehiclesService.update(vehicleId, { estado: 'reservado' });

    const reservation = this.reservationRepository.create({
      userId,
      vehicleId,
      metodoPago,
      montoReservado,
      fechaReserva: new Date().toISOString().split('T')[0],
      estado: 'confirmada',
    });

    return this.reservationRepository.save(reservation);
  }

  async findAll() {
    return this.reservationRepository.find({
      relations: { user: true, vehicle: true },
      order: { fechaReserva: 'DESC' },
    });
  }

  async findByUserId(userId: string) {
    return this.reservationRepository.find({
      where: { userId },
      relations: { vehicle: true },
      order: { fechaReserva: 'DESC' },
    });
  }

  async updateStatus(id: string, status: 'pendiente' | 'confirmada' | 'cancelada') {
    const reservation = await this.reservationRepository.findOne({ where: { id } });
    if (!reservation) {
      throw new NotFoundException(`Reserva con id ${id} no encontrada.`);
    }

    reservation.estado = status;
    
    if (status === 'cancelada') {
      await this.vehiclesService.update(reservation.vehicleId, { estado: 'disponible' });
    } else {
      await this.vehiclesService.update(reservation.vehicleId, { estado: 'reservado' });
    }

    return this.reservationRepository.save(reservation);
  }
}
