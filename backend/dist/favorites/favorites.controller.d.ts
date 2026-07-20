import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findMyFavorites(req: any): Promise<string[]>;
    toggleFavorite(vehicleId: string, req: any): Promise<{
        favorited: boolean;
    }>;
}
