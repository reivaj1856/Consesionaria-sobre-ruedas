import { IsNotEmpty, IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateQuoteDto {
  @IsNotEmpty({ message: 'El nombre es requerido' })
  nombre: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  @IsNotEmpty({ message: 'El correo electrónico es requerido' })
  email: string;

  @IsNotEmpty({ message: 'El teléfono es requerido' })
  telefono: string;

  @IsOptional()
  mensaje?: string;

  @IsOptional()
  vehicleId?: string;
}
