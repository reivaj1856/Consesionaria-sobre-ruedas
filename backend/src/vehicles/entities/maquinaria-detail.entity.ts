import { Entity, Column, PrimaryColumn, OneToOne, JoinColumn } from 'typeorm';
import { Vehicle } from './vehicle.entity';

@Entity('maquinarias')
export class MaquinariaDetail {
  @PrimaryColumn()
  id: string;

  @Column({ type: 'int' })
  pesoOperativo: number;

  @Column({ type: 'int' })
  horasUso: number;

  @OneToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  vehicle: Vehicle;
}
