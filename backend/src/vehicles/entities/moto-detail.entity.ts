import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('motos')
export class MotoDetail {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'int' })
  cilindrada: number;

  @Column()
  tipoMoto: string;

  @OneToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  vehicle: Vehicle;
}
