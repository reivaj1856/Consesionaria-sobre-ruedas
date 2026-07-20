import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Specification } from './entities/specification.entity';
import { SpecificationGroup } from './entities/specification-group.entity';
import { SpecificationsService } from './specifications.service';
import { SpecificationsController } from './specifications.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Specification, SpecificationGroup]),
    AuthModule,
  ],
  providers: [SpecificationsService],
  controllers: [SpecificationsController],
  exports: [SpecificationsService, TypeOrmModule],
})
export class SpecificationsModule {}
