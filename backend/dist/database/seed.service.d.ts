import { OnApplicationBootstrap } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { AutoDetail } from '../vehicles/entities/auto-detail.entity';
import { MotoDetail } from '../vehicles/entities/moto-detail.entity';
import { MaquinariaDetail } from '../vehicles/entities/maquinaria-detail.entity';
import { Specification } from '../specifications/entities/specification.entity';
import { SpecificationGroup } from '../specifications/entities/specification-group.entity';
import { CarouselSlide } from '../carousel/entities/carousel.entity';
export declare class SeedService implements OnApplicationBootstrap {
    private readonly userRepository;
    private readonly vehicleRepository;
    private readonly autoRepository;
    private readonly motoRepository;
    private readonly maquinariaRepository;
    private readonly specificationRepository;
    private readonly groupRepository;
    private readonly carouselRepository;
    private readonly logger;
    constructor(userRepository: Repository<User>, vehicleRepository: Repository<Vehicle>, autoRepository: Repository<AutoDetail>, motoRepository: Repository<MotoDetail>, maquinariaRepository: Repository<MaquinariaDetail>, specificationRepository: Repository<Specification>, groupRepository: Repository<SpecificationGroup>, carouselRepository: Repository<CarouselSlide>);
    onApplicationBootstrap(): Promise<void>;
    private seedUsers;
    private seedSpecifications;
    private seedVehicles;
    private seedCarousel;
}
