"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const auth_module_1 = require("./auth/auth.module");
const vehicles_module_1 = require("./vehicles/vehicles.module");
const reservations_module_1 = require("./reservations/reservations.module");
const favorites_module_1 = require("./favorites/favorites.module");
const quotes_module_1 = require("./quotes/quotes.module");
const specifications_module_1 = require("./specifications/specifications.module");
const carousel_module_1 = require("./carousel/carousel.module");
const seed_service_1 = require("./database/seed.service");
const user_entity_1 = require("./users/entities/user.entity");
const vehicle_entity_1 = require("./vehicles/entities/vehicle.entity");
const reservation_entity_1 = require("./reservations/entities/reservation.entity");
const favorite_entity_1 = require("./favorites/entities/favorite.entity");
const quote_entity_1 = require("./quotes/entities/quote.entity");
const auto_detail_entity_1 = require("./vehicles/entities/auto-detail.entity");
const moto_detail_entity_1 = require("./vehicles/entities/moto-detail.entity");
const maquinaria_detail_entity_1 = require("./vehicles/entities/maquinaria-detail.entity");
const specification_entity_1 = require("./specifications/entities/specification.entity");
const specification_group_entity_1 = require("./specifications/entities/specification-group.entity");
const carousel_entity_1 = require("./carousel/entities/carousel.entity");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    type: 'mysql',
                    host: config.get('DB_HOST') || 'localhost',
                    port: config.get('DB_PORT') || 3306,
                    username: config.get('DB_USERNAME') || 'root',
                    password: config.get('DB_PASSWORD') || '',
                    database: config.get('DB_DATABASE') || 'concesionaria_db',
                    entities: [
                        user_entity_1.User, vehicle_entity_1.Vehicle, reservation_entity_1.Reservation, favorite_entity_1.Favorite, quote_entity_1.Quote,
                        auto_detail_entity_1.AutoDetail, moto_detail_entity_1.MotoDetail, maquinaria_detail_entity_1.MaquinariaDetail,
                        specification_entity_1.Specification, specification_group_entity_1.SpecificationGroup, carousel_entity_1.CarouselSlide
                    ],
                    synchronize: true,
                }),
            }),
            auth_module_1.AuthModule,
            vehicles_module_1.VehiclesModule,
            reservations_module_1.ReservationsModule,
            favorites_module_1.FavoritesModule,
            quotes_module_1.QuotesModule,
            specifications_module_1.SpecificationsModule,
            carousel_module_1.CarouselModule,
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User, vehicle_entity_1.Vehicle, auto_detail_entity_1.AutoDetail, moto_detail_entity_1.MotoDetail, maquinaria_detail_entity_1.MaquinariaDetail,
                specification_entity_1.Specification, specification_group_entity_1.SpecificationGroup, carousel_entity_1.CarouselSlide
            ]),
        ],
        providers: [seed_service_1.SeedService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map