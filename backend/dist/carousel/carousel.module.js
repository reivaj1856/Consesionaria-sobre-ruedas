"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarouselModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const carousel_entity_1 = require("./entities/carousel.entity");
const carousel_service_1 = require("./carousel.service");
const carousel_controller_1 = require("./carousel.controller");
const auth_module_1 = require("../auth/auth.module");
let CarouselModule = class CarouselModule {
};
exports.CarouselModule = CarouselModule;
exports.CarouselModule = CarouselModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([carousel_entity_1.CarouselSlide]),
            auth_module_1.AuthModule,
        ],
        providers: [carousel_service_1.CarouselService],
        controllers: [carousel_controller_1.CarouselController],
        exports: [carousel_service_1.CarouselService],
    })
], CarouselModule);
//# sourceMappingURL=carousel.module.js.map