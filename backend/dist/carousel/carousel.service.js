"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const carousel_entity_1 = require("./entities/carousel.entity");
let CarouselService = class CarouselService {
    carouselRepository;
    constructor(carouselRepository) {
        this.carouselRepository = carouselRepository;
    }
    async findAll() {
        return this.carouselRepository.find({ order: { id: 'ASC' } });
    }
    async findOne(id) {
        const slide = await this.carouselRepository.findOne({ where: { id } });
        if (!slide) {
            throw new common_1.NotFoundException(`Slide con id ${id} no encontrado.`);
        }
        return slide;
    }
    async create(slideData) {
        const slide = this.carouselRepository.create(slideData);
        return this.carouselRepository.save(slide);
    }
    async update(id, slideData) {
        const slide = await this.findOne(id);
        Object.assign(slide, slideData);
        return this.carouselRepository.save(slide);
    }
    async remove(id) {
        const slide = await this.findOne(id);
        await this.carouselRepository.remove(slide);
        return { success: true, message: `Slide con id ${id} eliminado exitosamente.` };
    }
};
exports.CarouselService = CarouselService;
exports.CarouselService = CarouselService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(carousel_entity_1.CarouselSlide)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CarouselService);
//# sourceMappingURL=carousel.service.js.map