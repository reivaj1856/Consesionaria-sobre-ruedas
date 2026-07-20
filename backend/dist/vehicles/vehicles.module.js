"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const auto_detail_entity_1 = require("./entities/auto-detail.entity");
const moto_detail_entity_1 = require("./entities/moto-detail.entity");
const maquinaria_detail_entity_1 = require("./entities/maquinaria-detail.entity");
const vehicles_service_1 = require("./vehicles.service");
const vehicles_controller_1 = require("./vehicles.controller");
const auth_module_1 = require("../auth/auth.module");
const specifications_module_1 = require("../specifications/specifications.module");
const user_entity_1 = require("../users/entities/user.entity");
let VehiclesModule = class VehiclesModule {
};
exports.VehiclesModule = VehiclesModule;
exports.VehiclesModule = VehiclesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([vehicle_entity_1.Vehicle, auto_detail_entity_1.AutoDetail, moto_detail_entity_1.MotoDetail, maquinaria_detail_entity_1.MaquinariaDetail, user_entity_1.User]),
            auth_module_1.AuthModule,
            specifications_module_1.SpecificationsModule,
        ],
        providers: [vehicles_service_1.VehiclesService],
        controllers: [vehicles_controller_1.VehiclesController],
        exports: [vehicles_service_1.VehiclesService, typeorm_1.TypeOrmModule],
    })
], VehiclesModule);
//# sourceMappingURL=vehicles.module.js.map