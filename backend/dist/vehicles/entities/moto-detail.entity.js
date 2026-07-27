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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MotoDetail = void 0;
const typeorm_1 = require("typeorm");
const vehicle_entity_1 = require("./vehicle.entity");
let MotoDetail = class MotoDetail {
    id;
    cilindrada;
    tipoMoto;
    autonomia;
    tamanoBateria;
    vehicle;
};
exports.MotoDetail = MotoDetail;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], MotoDetail.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], MotoDetail.prototype, "cilindrada", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], MotoDetail.prototype, "tipoMoto", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MotoDetail.prototype, "autonomia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Object)
], MotoDetail.prototype, "tamanoBateria", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => vehicle_entity_1.Vehicle, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'id' }),
    __metadata("design:type", vehicle_entity_1.Vehicle)
], MotoDetail.prototype, "vehicle", void 0);
exports.MotoDetail = MotoDetail = __decorate([
    (0, typeorm_1.Entity)('motos')
], MotoDetail);
//# sourceMappingURL=moto-detail.entity.js.map