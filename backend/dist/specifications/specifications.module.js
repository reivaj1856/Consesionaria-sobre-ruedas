"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const specification_entity_1 = require("./entities/specification.entity");
const specification_group_entity_1 = require("./entities/specification-group.entity");
const specifications_service_1 = require("./specifications.service");
const specifications_controller_1 = require("./specifications.controller");
const auth_module_1 = require("../auth/auth.module");
let SpecificationsModule = class SpecificationsModule {
};
exports.SpecificationsModule = SpecificationsModule;
exports.SpecificationsModule = SpecificationsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([specification_entity_1.Specification, specification_group_entity_1.SpecificationGroup]),
            auth_module_1.AuthModule,
        ],
        providers: [specifications_service_1.SpecificationsService],
        controllers: [specifications_controller_1.SpecificationsController],
        exports: [specifications_service_1.SpecificationsService, typeorm_1.TypeOrmModule],
    })
], SpecificationsModule);
//# sourceMappingURL=specifications.module.js.map