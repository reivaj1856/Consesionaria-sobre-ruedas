import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('autos')
export class AutoDetail {
  @PrimaryColumn()
  id: string;

  @Column()
  carroceria: string;

  @Column({ type: 'int' })
  puertas: number;

  @Column({ type: 'int' })
  pasajeros: number;

  @OneToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  vehicle: Vehicle;
}
