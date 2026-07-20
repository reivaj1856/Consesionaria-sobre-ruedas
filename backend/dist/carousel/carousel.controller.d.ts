import { CarouselService } from './carousel.service';
export declare class CarouselController {
    private readonly carouselService;
    constructor(carouselService: CarouselService);
    findAll(): Promise<import("./entities/carousel.entity").CarouselSlide[]>;
    findOne(id: number): Promise<import("./entities/carousel.entity").CarouselSlide>;
    create(slideData: any): Promise<import("./entities/carousel.entity").CarouselSlide>;
    update(id: number, slideData: any): Promise<import("./entities/carousel.entity").CarouselSlide>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
