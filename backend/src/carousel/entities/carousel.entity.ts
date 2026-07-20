import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('carousel_slides')
export class CarouselSlide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumtext' })
  image: string; // Base64 representation

  @Column()
  badge: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  link: string;

  @Column({ type: 'varchar', length: 20, default: 'izquierda' })
  alineacion: 'izquierda' | 'centro' | 'derecho';
}
