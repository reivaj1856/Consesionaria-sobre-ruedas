import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity('configuraciones')
export class Setting {
  @PrimaryColumn()
  clave: string;

  @Column()
  valor: string;
}
