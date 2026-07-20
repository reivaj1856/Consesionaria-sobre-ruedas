import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { VehiclesService } from '../vehicles/vehicles.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    private readonly vehiclesService: VehiclesService,
  ) {}

  async findAllByUser(userId: string) {
    const favorites = await this.favoriteRepository.find({
      where: { userId },
      select: { vehicleId: true },
    });
    return favorites.map((f) => f.vehicleId);
  }

  async toggleFavorite(userId: string, vehicleId: string) {
    await this.vehiclesService.findOne(vehicleId);

    const existing = await this.favoriteRepository.findOne({
      where: { userId, vehicleId },
    });

    if (existing) {
      await this.favoriteRepository.remove(existing);
      return { favorited: false };
    } else {
      const favorite = this.favoriteRepository.create({ userId, vehicleId });
      await this.favoriteRepository.save(favorite);
      return { favorited: true };
    }
  }
}
