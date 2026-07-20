import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SubscribeDto {
  @IsEnum(['gratis', 'negocio', 'empresa'], { message: 'El plan seleccionado no es válido' })
  @IsNotEmpty({ message: 'El plan es requerido' })
  plan: 'gratis' | 'negocio' | 'empresa';

  @IsOptional()
  @IsString()
  cardNumber?: string;

  @IsOptional()
  @IsString()
  cardExpiry?: string;

  @IsOptional()
  @IsString()
  cardCvv?: string;

  @IsOptional()
  @IsString()
  cardHolderName?: string;
}
