import { Repository } from 'typeorm';
import { CarouselSlide } from './entities/carousel.entity';
export declare class CarouselService {
    private readonly carouselRepository;
    constructor(carouselRepository: Repository<CarouselSlide>);
    findAll(): Promise<CarouselSlide[]>;
    findOne(id: number): Promise<CarouselSlide>;
    create(slideData: Partial<CarouselSlide>): Promise<CarouselSlide>;
    update(id: number, slideData: Partial<CarouselSlide>): Promise<CarouselSlide>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
