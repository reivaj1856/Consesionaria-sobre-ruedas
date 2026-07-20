import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty({ message: 'El id del vehículo es requerido' })
  vehicleId: string;

  @IsNotEmpty({ message: 'El método de pago es requerido' })
  metodoPago: string;

  @IsNumber({}, { message: 'El monto reservado debe ser un número' })
  montoReservado: number;
}
