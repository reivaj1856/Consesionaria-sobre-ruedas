import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { VehiclesService } from '../vehicles/vehicles.service';
export declare class FavoritesService {
    private readonly favoriteRepository;
    private readonly vehiclesService;
    constructor(favoriteRepository: Repository<Favorite>, vehiclesService: VehiclesService);
    findAllByUser(userId: string): Promise<string[]>;
    toggleFavorite(userId: string, vehicleId: string): Promise<{
        favorited: boolean;
    }>;
}
