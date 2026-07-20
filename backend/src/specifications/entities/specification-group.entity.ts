import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Specification } from './specification.entity';

@Entity('specification_groups')
export class SpecificationGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @OneToMany(() => Specification, (spec) => spec.grupo, { cascade: true })
  especificaciones: Specification[];
}
