import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { AutoDetail } from './entities/auto-detail.entity';
import { MotoDetail } from './entities/moto-detail.entity';
import { MaquinariaDetail } from './entities/maquinaria-detail.entity';
import { VehiclesService } from './vehicles.service';
import { VehiclesController } from './vehicles.controller';
import { AuthModule } from '../auth/auth.module';
import { SpecificationsModule } from '../specifications/specifications.module';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Vehicle, AutoDetail, MotoDetail, MaquinariaDetail, User]),
    AuthModule,
    SpecificationsModule,
  ],
  providers: [VehiclesService],
  controllers: [VehiclesController],
  exports: [VehiclesService, TypeOrmModule],
})
export class VehiclesModule {}
