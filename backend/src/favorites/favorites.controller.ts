import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('favorites')
@UseGuards(JwtAuthGuard)
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  async findMyFavorites(@Request() req: any) {
    return this.favoritesService.findAllByUser(req.user.id);
  }

  @Post(':vehicleId')
  async toggleFavorite(@Param('vehicleId') vehicleId: string, @Request() req: any) {
    return this.favoritesService.toggleFavorite(req.user.id, vehicleId);
  }
}
