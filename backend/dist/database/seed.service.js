"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../users/entities/user.entity");
const vehicle_entity_1 = require("../vehicles/entities/vehicle.entity");
const auto_detail_entity_1 = require("../vehicles/entities/auto-detail.entity");
const moto_detail_entity_1 = require("../vehicles/entities/moto-detail.entity");
const maquinaria_detail_entity_1 = require("../vehicles/entities/maquinaria-detail.entity");
const specification_entity_1 = require("../specifications/entities/specification.entity");
const specification_group_entity_1 = require("../specifications/entities/specification-group.entity");
const carousel_entity_1 = require("../carousel/entities/carousel.entity");
const seed_data_1 = require("./seed-data");
const bcrypt = __importStar(require("bcrypt"));
let SeedService = SeedService_1 = class SeedService {
    userRepository;
    vehicleRepository;
    autoRepository;
    motoRepository;
    maquinariaRepository;
    specificationRepository;
    groupRepository;
    carouselRepository;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(userRepository, vehicleRepository, autoRepository, motoRepository, maquinariaRepository, specificationRepository, groupRepository, carouselRepository) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.autoRepository = autoRepository;
        this.motoRepository = motoRepository;
        this.maquinariaRepository = maquinariaRepository;
        this.specificationRepository = specificationRepository;
        this.groupRepository = groupRepository;
        this.carouselRepository = carouselRepository;
    }
    async onApplicationBootstrap() {
        this.logger.log('Iniciando verificación de datos de sembrado...');
        await this.seedUsers();
        await this.seedSpecifications();
        await this.seedVehicles();
        await this.seedCarousel();
        this.logger.log('Verificación de datos de sembrado finalizada.');
    }
    async seedUsers() {
        const userCount = await this.userRepository.count();
        if (userCount === 0) {
            this.logger.log('No se encontraron usuarios. Creando usuarios predeterminados...');
            const adminPasswordHash = await bcrypt.hash('admin123', 10);
            const clientPasswordHash = await bcrypt.hash('cliente123', 10);
            const admin = this.userRepository.create({
                nombre: 'Administrador Concesionaria',
                email: 'admin@concesionaria.com',
                contrasenia: adminPasswordHash,
                rol: 'admin',
            });
            const client = this.userRepository.create({
                nombre: 'Juan Pérez',
                email: 'cliente@concesionaria.com',
                contrasenia: clientPasswordHash,
                rol: 'cliente',
            });
            await this.userRepository.save([admin, client]);
            this.logger.log('Usuarios predeterminados creados exitosamente.');
        }
    }
    async seedSpecifications() {
        const groupCount = await this.groupRepository.count();
        if (groupCount === 0) {
            this.logger.log('No se encontraron grupos de especificaciones. Sembrando...');
            const mapping = {
                'Seguridad': [
                    "4X4", "ABS", "Airbag: Conductor", "Airbag: pasajero", "CBS", "Combined braking system",
                    "EPS", "ESP", "Frenos antibloqueo", "Modern Disc Brakes", "Safer helmets", "Security System", "Traction Control"
                ],
                'Confort & Interior': [
                    "Aire acondicionado: Delantero", "Aire acondicionado: Trasero", "Asientos tipo cubo",
                    "Calefacción auxiliar", "Heated Seats", "Leather", "Leather Interior", "Memory Seats",
                    "Power Seats", "Power Steering", "Power Windows", "Quartz polymer countertops in galley and lavatories",
                    "Sunroof", "Panoramic roof", "Third Row Seats", "Zee Air Conditioner System"
                ],
                'Tecnología & Entretenimiento': [
                    "Bluetooth", "Boots", "CD player", "Central locking", "Cruise Control", "Dis-Tronic",
                    "DVD System", "Electric side mirror", "Emergency Communicator", "GPS", "Hands-Free",
                    "Head-up display", "Keyless Entry", "MP3 interface", "MP3 Player", "Navigation",
                    "Navigation system", "Parking sensors", "Cámara de visión trasera", "Piloto automático",
                    "Portable Audio", "Power Locks", "Premium Audio", "Software autoupdate", "Wi-Fi",
                    "Windows Defroster", "Wiper Tinted Glass", "Six (6) articulating holders for electronic tablets (outboard of console tables)",
                    "Monitor HD de 24 pulgadas en el mamparo derecho de popa."
                ],
                'Rendimiento & Carrocería': [
                    "Eficiencia aerodinámica", "Fog Lights", "Flat Repair Kit", "Performance Tyres",
                    "Liquid Cooling", "Llantas de aleación", "Nitro", "Sport Body Kit", "Sports package",
                    "Sports suspension", "Turbo-engine", "Una combinación moderna de chasis y suspensión",
                    "Urban kit", "Tow Package", "Trailer Hitch"
                ],
                'Aviación & Especiales': [
                    "Collins Electronic Charts Cockpit - Dual IFIS", "Emergency Vision Assurance System (EVAS)",
                    "Left and Right Landing Lights", "Runway Awareness Advisory System (RAAS)", "Salida ADS-B",
                    "Sistema de combustible de 228 galones", "Steam/convection oven", "WAAS/LPV",
                    "Wingtip Nav and Strobe Lights", "XM Weather / Rosenview LX Moving Map"
                ],
                'Accesorios': [
                    "Spare Face Shield/Visor", "Tank Bag"
                ]
            };
            for (const [groupName, specs] of Object.entries(mapping)) {
                const group = this.groupRepository.create({ nombre: groupName });
                const savedGroup = await this.groupRepository.save(group);
                const specEntities = specs.map(name => this.specificationRepository.create({
                    nombre: name,
                    grupoId: savedGroup.id
                }));
                await this.specificationRepository.save(specEntities);
            }
            this.logger.log('Grupos y especificaciones creados con éxito.');
        }
    }
    async seedVehicles() {
        const vehicleCount = await this.vehicleRepository.count();
        if (vehicleCount === 0) {
            this.logger.log('No se encontraron vehículos. Insertando catálogo original...');
            const subtypesDetails = {
                'auto-01': { type: 'autos', details: { carroceria: 'Camioneta', puertas: 4, pasajeros: 5 } },
                'auto-02': { type: 'autos', details: { carroceria: 'Hatchback', puertas: 5, pasajeros: 5 } },
                'auto-03': { type: 'autos', details: { carroceria: 'Coupé', puertas: 2, pasajeros: 4 } },
                'moto-01': { type: 'motos', details: { cilindrada: 471, tipoMoto: 'Adventure' } },
                'moto-02': { type: 'motos', details: { cilindrada: 890, tipoMoto: 'Naked' } },
                'moto-03': { type: 'motos', details: { cilindrada: 1254, tipoMoto: 'Adventure' } },
                'maquinaria-01': { type: 'maquinaria', details: { pesoOperativo: 20500, horasUso: 2400 } },
                'maquinaria-02': { type: 'maquinaria', details: { pesoOperativo: 7500, horasUso: 3100 } },
                'maquinaria-03': { type: 'maquinaria', details: { pesoOperativo: 8135, horasUso: 150 } },
            };
            const vehicleSpecsMapping = {
                'auto-01': ["4X4", "ABS", "Airbag: Conductor", "Airbag: pasajero", "Aire acondicionado: Delantero", "Bluetooth", "Cámara de visión trasera", "Tow Package"],
                'auto-02': ["ABS", "Airbag: Conductor", "Airbag: pasajero", "Aire acondicionado: Delantero", "Bluetooth", "Keyless Entry", "Navigation system"],
                'auto-03': ["ABS", "Airbag: Conductor", "Airbag: pasajero", "Aire acondicionado: Delantero", "Bluetooth", "Leather Interior", "Premium Audio", "Sports suspension"],
                'moto-01': ["ABS", "Safer helmets", "Liquid Cooling", "Modern Disc Brakes"],
                'moto-02': ["ABS", "Liquid Cooling", "Modern Disc Brakes", "Sports suspension", "Traction Control"],
                'moto-03': ["ABS", "Heated Seats", "Liquid Cooling", "Modern Disc Brakes", "GPS", "Traction Control"],
                'maquinaria-01': ["Aire acondicionado: Delantero", "Security System", "Turbo-engine"],
                'maquinaria-02': ["Aire acondicionado: Delantero", "Power Steering", "4X4"],
                'maquinaria-03': ["Aire acondicionado: Delantero", "4X4", "Turbo-engine"],
            };
            for (const v of seed_data_1.SEED_VEHICLES) {
                const tieneTour = v.id === 'auto-03';
                const imagen360 = v.id === 'auto-03'
                    ? 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000'
                    : null;
                const hotspots = v.id === 'auto-03' ? [
                    { id: 1, top: '48%', left: '16%', title: 'Faros Láser HD', description: 'Sistema de iluminación inteligente LED que se adapta a las curvas de la carretera de forma activa.' },
                    { id: 2, top: '72%', left: '32%', title: 'Frenos de Carbono Cerámica', description: 'Discos cerámicos sobredimensionados para frenadas a alta velocidad con fatiga cero.' },
                    { id: 3, top: '45%', left: '60%', title: 'Motor Eléctrico Dual', description: 'Propulsión síncrona en ambos ejes de hasta 761 HP y aceleración de 0 a 100 en 2.8s.' },
                    { id: 4, top: '55%', left: '84%', title: 'Spoiler Aerodinámico Activo', description: 'Alerón retráctil de 3 posiciones para maximizar la carga vertical y estabilidad a alta velocidad.' }
                ] : null;
                const vehicle = this.vehicleRepository.create({
                    id: v.id,
                    nombre: v.nombre,
                    marca: v.marca,
                    modelo: v.modelo,
                    anio: v.anio,
                    precio: v.precio,
                    categoria: v.categoria,
                    tipoCombustible: v.tipoCombustible,
                    transmision: v.transmision,
                    kilometraje: v.kilometraje,
                    condicion: v.condicion,
                    ubicacion: v.ubicacion,
                    imagenPrincipal: v.imagenPrincipal,
                    imagenes: v.imagenes,
                    descripcion: v.descripcion,
                    destacado: v.destacado,
                    estado: v.estado,
                    fechaIngreso: v.fechaIngreso,
                    tieneTour,
                    imagen360,
                    hotspots,
                    especificaciones: []
                });
                const specNames = vehicleSpecsMapping[v.id] || [];
                if (specNames.length > 0) {
                    const specs = await this.specificationRepository.find({
                        where: specNames.map((name) => ({ nombre: name }))
                    });
                    vehicle.especificaciones = specs;
                }
                const savedVehicle = await this.vehicleRepository.save(vehicle);
                const subData = subtypesDetails[v.id];
                if (subData) {
                    if (subData.type === 'autos') {
                        const detail = this.autoRepository.create({
                            ...subData.details,
                            id: savedVehicle.id
                        });
                        await this.autoRepository.save(detail);
                    }
                    else if (subData.type === 'motos') {
                        const detail = this.motoRepository.create({
                            ...subData.details,
                            id: savedVehicle.id
                        });
                        await this.motoRepository.save(detail);
                    }
                    else if (subData.type === 'maquinaria') {
                        const detail = this.maquinariaRepository.create({
                            ...subData.details,
                            id: savedVehicle.id
                        });
                        await this.maquinariaRepository.save(detail);
                    }
                }
            }
            this.logger.log(`Catálogo original insertado exitosamente con subtipos, especificaciones y tour de demostración (${seed_data_1.SEED_VEHICLES.length} vehículos).`);
        }
    }
    async seedCarousel() {
        const slideCount = await this.carouselRepository.count();
        if (slideCount === 0) {
            this.logger.log('No se encontraron diapositivas del carrusel. Sembrando las originales...');
            const slides = [
                {
                    image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1000',
                    badge: 'Encuentra el tuyo hoy',
                    title: 'Tu próximo vehículo premium está en ruedas.store',
                    description: 'Explora una selección única de autos, camionetas y deportivos de primera calidad con asesoramiento premium personalizado.',
                    link: '/catalogo'
                },
                {
                    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1000',
                    badge: 'Pasión en Dos Ruedas',
                    title: 'Siente la adrenalina en su máxima expresión',
                    description: 'Motocicletas deportivas, urbanas y de aventura seleccionadas con los más altos estándares de rendimiento y seguridad.',
                    link: '/catalogo'
                },
                {
                    image: 'https://images.unsplash.com/photo-1579294800821-2e41879e6022?auto=format&fit=crop&q=80&w=1000',
                    badge: 'Maquinaria de Alto Poder',
                    title: 'Soluciones robustas para tu negocio o industria',
                    description: 'Excavadoras, grúas y tractores de potencia garantizada para impulsar la productividad de tus grandes obras.',
                    link: '/catalogo'
                }
            ];
            const entities = slides.map(s => this.carouselRepository.create(s));
            await this.carouselRepository.save(entities);
            this.logger.log('Diapositivas del carrusel predeterminadas creadas exitosamente.');
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(2, (0, typeorm_1.InjectRepository)(auto_detail_entity_1.AutoDetail)),
    __param(3, (0, typeorm_1.InjectRepository)(moto_detail_entity_1.MotoDetail)),
    __param(4, (0, typeorm_1.InjectRepository)(maquinaria_detail_entity_1.MaquinariaDetail)),
    __param(5, (0, typeorm_1.InjectRepository)(specification_entity_1.Specification)),
    __param(6, (0, typeorm_1.InjectRepository)(specification_group_entity_1.SpecificationGroup)),
    __param(7, (0, typeorm_1.InjectRepository)(carousel_entity_1.CarouselSlide)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SeedService);
//# sourceMappingURL=seed.service.js.map