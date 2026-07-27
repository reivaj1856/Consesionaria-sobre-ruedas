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

  @Column({ type: 'int', nullable: true })
  autonomia: number | null;

  @Column({ type: 'int', nullable: true })
  tamanoBateria: number | null;

  @OneToOne(() => Vehicle, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'id' })
  vehicle: Vehicle;
}
