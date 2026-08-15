import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Setting } from '../users/entities/setting.entity';
import { Vehicle } from '../vehicles/entities/vehicle.entity';
import { AutoDetail } from '../vehicles/entities/auto-detail.entity';
import { MotoDetail } from '../vehicles/entities/moto-detail.entity';
import { MaquinariaDetail } from '../vehicles/entities/maquinaria-detail.entity';
import { Specification } from '../specifications/entities/specification.entity';
import { SpecificationGroup } from '../specifications/entities/specification-group.entity';
import { CarouselSlide } from '../carousel/entities/carousel.entity';
import { SEED_VEHICLES } from './seed-data';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>,
    @InjectRepository(Vehicle)
    private readonly vehicleRepository: Repository<Vehicle>,
    @InjectRepository(AutoDetail)
    private readonly autoRepository: Repository<AutoDetail>,
    @InjectRepository(MotoDetail)
    private readonly motoRepository: Repository<MotoDetail>,
    @InjectRepository(MaquinariaDetail)
    private readonly maquinariaRepository: Repository<MaquinariaDetail>,
    @InjectRepository(Specification)
    private readonly specificationRepository: Repository<Specification>,
    @InjectRepository(SpecificationGroup)
    private readonly groupRepository: Repository<SpecificationGroup>,
    @InjectRepository(CarouselSlide)
    private readonly carouselRepository: Repository<CarouselSlide>,
  ) {}

  async onApplicationBootstrap() {
    this.logger.log('Iniciando verificación de datos de sembrado...');
    await this.seedUsers();
    await this.seedSettings();
    await this.seedSpecifications();
    await this.seedVehicles();
    await this.seedCarousel();
    this.logger.log('Verificación de datos de sembrado finalizada.');
  }

  private async seedUsers() {
    const adminPasswordHash = await bcrypt.hash('admin123', 10);
    const clientPasswordHash = await bcrypt.hash('cliente123', 10);

    let admin = await this.userRepository.findOne({ where: { email: 'admin@concesionaria.com' } });
    if (!admin) {
      admin = this.userRepository.create({
        nombre: 'Administrador Concesionaria',
        email: 'admin@concesionaria.com',
        contrasenia: adminPasswordHash,
        rol: 'administrador',
      });
      await this.userRepository.save(admin);
    }

    let concesionaria = await this.userRepository.findOne({ where: { email: 'toyota@concesionaria.com' } });
    if (!concesionaria) {
      concesionaria = this.userRepository.create({
        nombre: 'Toyota Bolivia',
        email: 'toyota@concesionaria.com',
        contrasenia: clientPasswordHash,
        rol: 'concesionaria',
      });
      concesionaria = await this.userRepository.save(concesionaria);
    }

    let agente = await this.userRepository.findOne({ where: { email: 'agente@concesionaria.com' } });
    if (!agente) {
      agente = this.userRepository.create({
        nombre: 'Juan Agente',
        email: 'agente@concesionaria.com',
        contrasenia: clientPasswordHash,
        rol: 'agente',
        concesionariaId: concesionaria.id,
        beneficios: 0,
      });
      await this.userRepository.save(agente);
    }

    let cliente = await this.userRepository.findOne({ where: { email: 'cliente@concesionaria.com' } });
    if (!cliente) {
      cliente = this.userRepository.create({
        nombre: 'Cliente General',
        email: 'cliente@concesionaria.com',
        contrasenia: clientPasswordHash,
        rol: 'cliente',
      });
      await this.userRepository.save(cliente);
    }

    this.logger.log('Usuarios predeterminados verificados/creados exitosamente.');
  }

  private async seedSettings() {
    const settingExists = await this.settingRepository.findOne({ where: { clave: 'beneficio_agente' } });
    if (!settingExists) {
      this.logger.log('No se encontró la configuración del beneficio. Sembrando...');
      const setting = this.settingRepository.create({
        clave: 'beneficio_agente',
        valor: '100'
      });
      await this.settingRepository.save(setting);
      this.logger.log('Configuraciones predeterminadas creadas exitosamente.');
    }
  }

  private async seedSpecifications() {
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
        
        const specEntities = specs.map(name => 
          this.specificationRepository.create({
            nombre: name,
            grupoId: savedGroup.id
          })
        );
        await this.specificationRepository.save(specEntities);
      }
      this.logger.log('Grupos y especificaciones creados con éxito.');
    }
  }

  private async seedVehicles() {
    const vehicleCount = await this.vehicleRepository.count();
    if (vehicleCount === 0) {
      this.logger.log('No se encontraron vehículos. Insertando catálogo original...');

      const subtypesDetails: Record<string, { type: 'autos' | 'autos_electricos' | 'motos' | 'motos_electricos' | 'maquinaria_agricola' | 'transporte_pesado' | 'maquinaria'; details: any }> = {
        'auto-01': { type: 'autos', details: { carroceria: 'Camioneta', puertas: 4, pasajeros: 5 } },
        'auto-02': { type: 'autos', details: { carroceria: 'Hatchback', puertas: 5, pasajeros: 5 } },
        'auto-03': { type: 'autos', details: { carroceria: 'Coupé', puertas: 2, pasajeros: 4 } },
        'moto-01': { type: 'motos', details: { cilindrada: 471, tipoMoto: 'Adventure' } },
        'moto-02': { type: 'motos', details: { cilindrada: 890, tipoMoto: 'Naked' } },
        'moto-03': { type: 'motos', details: { cilindrada: 1254, tipoMoto: 'Adventure' } },
        'maquinaria-01': { type: 'transporte_pesado', details: { pesoOperativo: 20500, horasUso: 2400 } },
        'maquinaria-02': { type: 'maquinaria_agricola', details: { pesoOperativo: 7500, horasUso: 3100 } },
        'maquinaria-03': { type: 'maquinaria_agricola', details: { pesoOperativo: 8135, horasUso: 150 } },
        'auto-ev-01': { type: 'autos_electricos', details: { carroceria: 'Sedán', puertas: 4, pasajeros: 5, autonomia: 629, tamanoBateria: 75 } },
        'moto-ev-01': { type: 'motos_electricos', details: { cilindrada: 0, tipoMoto: 'Naked', autonomia: 235, tamanoBateria: 15 } },
      };

      const vehicleSpecsMapping: Record<string, string[]> = {
        'auto-01': ["4X4", "ABS", "Airbag: Conductor", "Airbag: pasajero", "Aire acondicionado: Delantero", "Bluetooth", "Cámara de visión trasera", "Tow Package"],
        'auto-02': ["ABS", "Airbag: Conductor", "Airbag: pasajero", "Aire acondicionado: Delantero", "Bluetooth", "Keyless Entry", "Navigation system"],
        'auto-03': ["ABS", "Airbag: Conductor", "Airbag: pasajero", "Aire acondicionado: Delantero", "Bluetooth", "Leather Interior", "Premium Audio", "Sports suspension"],
        'moto-01': ["ABS", "Safer helmets", "Liquid Cooling", "Modern Disc Brakes"],
        'moto-02': ["ABS", "Liquid Cooling", "Modern Disc Brakes", "Sports suspension", "Traction Control"],
        'moto-03': ["ABS", "Heated Seats", "Liquid Cooling", "Modern Disc Brakes", "GPS", "Traction Control"],
        'maquinaria-01': ["Aire acondicionado: Delantero", "Security System", "Turbo-engine"],
        'maquinaria-02': ["Aire acondicionado: Delantero", "Power Steering", "4X4"],
        'maquinaria-03': ["Aire acondicionado: Delantero", "4X4", "Turbo-engine"],
        'auto-ev-01': ["ABS", "Airbag: Conductor", "Airbag: pasajero", "Bluetooth", "Cámara de visión trasera", "Premium Audio", "Navigation system"],
        'moto-ev-01': ["ABS", "Liquid Cooling", "Modern Disc Brakes", "Sports suspension", "Traction Control"],
      };

      for (const v of SEED_VEHICLES) {
        const vehicle = this.vehicleRepository.create({
          id: v.id,
          nombre: v.nombre,
          marca: v.marca,
          modelo: v.modelo,
          anio: v.anio,
          precio: v.precio,
          categoria: v.categoria as any,
          tipoCombustible: v.tipoCombustible,
          transmision: v.transmision,
          kilometraje: v.kilometraje,
          condicion: v.condicion as any,
          ubicacion: v.ubicacion,
          imagenPrincipal: v.imagenPrincipal,
          imagenes: v.imagenes as any,
          descripcion: v.descripcion,
          destacado: v.destacado,
          estado: v.estado as any,
          fechaIngreso: v.fechaIngreso,
          telefonoContacto: (v as any).telefonoContacto || '59177490451',
          moneda: (v as any).moneda || 'USD',
          especificaciones: []
        });

        const specNames = vehicleSpecsMapping[v.id] || [];
        if (specNames.length > 0) {
          const specs = await this.specificationRepository.find({
            where: specNames.map((name: string) => ({ nombre: name }))
          });
          vehicle.especificaciones = specs;
        }

        const savedVehicle = await this.vehicleRepository.save(vehicle);

        const subData = subtypesDetails[v.id];
        if (subData) {
          if (subData.type === 'autos' || subData.type === 'autos_electricos') {
            const detail = this.autoRepository.create({
              ...subData.details,
              id: savedVehicle.id
            });
            await this.autoRepository.save(detail);
          } else if (subData.type === 'motos' || subData.type === 'motos_electricos') {
            const detail = this.motoRepository.create({
              ...subData.details,
              id: savedVehicle.id
            });
            await this.motoRepository.save(detail);
          } else if (subData.type === 'maquinaria' || subData.type === 'maquinaria_agricola' || subData.type === 'transporte_pesado') {
            const detail = this.maquinariaRepository.create({
              ...subData.details,
              id: savedVehicle.id
            });
            await this.maquinariaRepository.save(detail);
          }
        }
      }

      this.logger.log(`Catálogo original insertado exitosamente con subtipos, especificaciones y tour de demostración (${SEED_VEHICLES.length} vehículos).`);
    }
  }

  private async seedCarousel() {
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
          image: '/maquinaria_pesada.png',
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
}
