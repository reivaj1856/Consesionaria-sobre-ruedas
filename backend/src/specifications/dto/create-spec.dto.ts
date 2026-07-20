import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsNotEmpty({ message: 'El nombre del grupo es requerido' })
  nombre: string;
}

export class CreateSpecificationDto {
  @IsNotEmpty({ message: 'El nombre de la especificación es requerido' })
  nombre: string;

  @IsNumber({}, { message: 'El ID de grupo debe ser un número' })
  grupoId: number;
}
