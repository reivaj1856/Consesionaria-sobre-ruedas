import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('cotizaciones')
export class Quote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  email: string;

  @Column()
  telefono: string;

  @Column({ type: 'text', nullable: true })
  mensaje: string;

  @Column({ nullable: true })
  vehicleId: string;

  @Column({ type: 'varchar', length: 20 })
  fecha: string;

  @ManyToOne(() => Vehicle, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'vehicleId' })
  vehicle: Vehicle;
}
