import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('reservaciones')
export class Reservation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  vehicleId: string;

  @Column({ type: 'varchar', length: 20 })
  fechaReserva: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 500.00 })
  montoReservado: number;

  @Column()
  metodoPago: string;

  @Column({ type: 'varchar', length: 20, default: 'pendiente' })
  estado: 'pendiente' | 'confirmada' | 'cancelada';

  @ManyToOne(() => User, (user) => user.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Vehicle, (vehicle) => vehicle.reservas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;
}
