import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { CarouselService } from './carousel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('carousel')
export class CarouselController {
  constructor(private readonly carouselService: CarouselService) {}

  @Get()
  async findAll() {
    return this.carouselService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carouselService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Post()
  async create(@Body() slideData: any) {
    return this.carouselService.create(slideData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() slideData: any) {
    return this.carouselService.update(id, slideData);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'administrador')
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.carouselService.remove(id);
  }
}
