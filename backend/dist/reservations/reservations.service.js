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
exports.ReservationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const reservation_entity_1 = require("./entities/reservation.entity");
const vehicles_service_1 = require("../vehicles/vehicles.service");
let ReservationsService = class ReservationsService {
    reservationRepository;
    vehiclesService;
    constructor(reservationRepository, vehiclesService) {
        this.reservationRepository = reservationRepository;
        this.vehiclesService = vehiclesService;
    }
    async create(createReservationDto, userId) {
        const { vehicleId, metodoPago, montoReservado } = createReservationDto;
        const vehicle = await this.vehiclesService.findOne(vehicleId);
        if (vehicle.estado !== 'disponible') {
            throw new common_1.BadRequestException('El vehículo no está disponible para reserva.');
        }
        await this.vehiclesService.update(vehicleId, { estado: 'reservado' });
        const reservation = this.reservationRepository.create({
            userId,
            vehicleId,
            metodoPago,
            montoReservado,
            fechaReserva: new Date().toISOString().split('T')[0],
            estado: 'confirmada',
        });
        return this.reservationRepository.save(reservation);
    }
    async findAll() {
        return this.reservationRepository.find({
            relations: { user: true, vehicle: true },
            order: { fechaReserva: 'DESC' },
        });
    }
    async findByUserId(userId) {
        return this.reservationRepository.find({
            where: { userId },
            relations: { vehicle: true },
            order: { fechaReserva: 'DESC' },
        });
    }
    async updateStatus(id, status) {
        const reservation = await this.reservationRepository.findOne({ where: { id } });
        if (!reservation) {
            throw new common_1.NotFoundException(`Reserva con id ${id} no encontrada.`);
        }
        reservation.estado = status;
        if (status === 'cancelada') {
            await this.vehiclesService.update(reservation.vehicleId, { estado: 'disponible' });
        }
        else {
            await this.vehiclesService.update(reservation.vehicleId, { estado: 'reservado' });
        }
        return this.reservationRepository.save(reservation);
    }
};
exports.ReservationsService = ReservationsService;
exports.ReservationsService = ReservationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(reservation_entity_1.Reservation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        vehicles_service_1.VehiclesService])
], ReservationsService);
//# sourceMappingURL=reservations.service.js.map