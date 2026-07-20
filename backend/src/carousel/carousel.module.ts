import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarouselSlide } from './entities/carousel.entity';
import { CarouselService } from './carousel.service';
import { CarouselController } from './carousel.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarouselSlide]),
    AuthModule,
  ],
  providers: [CarouselService],
  controllers: [CarouselController],
  exports: [CarouselService],
})
export class CarouselModule {}
