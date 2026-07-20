import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Vehicle } from '../../vehicles/entities/vehicle.entity';

@Entity('usuarios')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  contrasenia: string;

  @Column()
  nombre: string;

  @Column({ type: 'varchar', length: 20, default: 'cliente' })
  rol: 'cliente' | 'admin';

  @Column({ type: 'varchar', length: 20, default: 'gratis' })
  plan: 'gratis' | 'negocio' | 'empresa';

  @Column({ type: 'varchar', length: 30, nullable: true })
  suscripcionFecha: string;

  @OneToMany(() => Reservation, (reservation) => reservation.user)
  reservas: Reservation[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favoritos: Favorite[];

  @OneToMany(() => Vehicle, (vehicle) => vehicle.user)
  vehiculos: Vehicle[];
}
