import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarouselSlide } from './entities/carousel.entity';

@Injectable()
export class CarouselService {
  constructor(
    @InjectRepository(CarouselSlide)
    private readonly carouselRepository: Repository<CarouselSlide>,
  ) {}

  async findAll() {
    return this.carouselRepository.find({ order: { id: 'ASC' } });
  }

  async findOne(id: number) {
    const slide = await this.carouselRepository.findOne({ where: { id } });
    if (!slide) {
      throw new NotFoundException(`Slide con id ${id} no encontrado.`);
    }
    return slide;
  }

  async create(slideData: Partial<CarouselSlide>) {
    const slide = this.carouselRepository.create(slideData);
    return this.carouselRepository.save(slide);
  }

  async update(id: number, slideData: Partial<CarouselSlide>) {
    const slide = await this.findOne(id);
    Object.assign(slide, slideData);
    return this.carouselRepository.save(slide);
  }

  async remove(id: number) {
    const slide = await this.findOne(id);
    await this.carouselRepository.remove(slide);
    return { success: true, message: `Slide con id ${id} eliminado exitosamente.` };
  }
}
