import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ReservationsModule } from './reservations/reservations.module';
import { FavoritesModule } from './favorites/favorites.module';
import { QuotesModule } from './quotes/quotes.module';
import { SpecificationsModule } from './specifications/specifications.module';
import { CarouselModule } from './carousel/carousel.module';
import { SeedService } from './database/seed.service';
import { User } from './users/entities/user.entity';
import { Vehicle } from './vehicles/entities/vehicle.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { Favorite } from './favorites/entities/favorite.entity';
import { Quote } from './quotes/entities/quote.entity';
import { AutoDetail } from './vehicles/entities/auto-detail.entity';
import { MotoDetail } from './vehicles/entities/moto-detail.entity';
import { MaquinariaDetail } from './vehicles/entities/maquinaria-detail.entity';
import { Specification } from './specifications/entities/specification.entity';
import { SpecificationGroup } from './specifications/entities/specification-group.entity';
import { CarouselSlide } from './carousel/entities/carousel.entity';
import { Setting } from './users/entities/setting.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST') || 'localhost',
        port: config.get<number>('DB_PORT') || 3306,
        username: config.get<string>('DB_USERNAME') || 'root',
        password: config.get<string>('DB_PASSWORD') || '',
        database: config.get<string>('DB_DATABASE') || 'concesionaria_db',
        entities: [
          User, Vehicle, Reservation, Favorite, Quote,
          AutoDetail, MotoDetail, MaquinariaDetail,
          Specification, SpecificationGroup, CarouselSlide, Setting
        ],
        synchronize: true,
      }),
    }),
    AuthModule,
    VehiclesModule,
    ReservationsModule,
    FavoritesModule,
    QuotesModule,
    SpecificationsModule,
    CarouselModule,
    TypeOrmModule.forFeature([
      User, Vehicle, AutoDetail, MotoDetail, MaquinariaDetail,
      Specification, SpecificationGroup, CarouselSlide, Setting
    ]),
  ],
  providers: [SeedService],
})
export class AppModule {}
