import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In } from 'typeorm';
import { Vehicle } from './entities/vehicle.entity';
import { AutoDetail } from './entities/auto-detail.entity';
import { MotoDetail } from './entities/moto-detail.entity';
import { MaquinariaDetail } from './entities/maquinaria-detail.entity';
import { Specification } from '../specifications/entities/specification.entity';
import { User } from '../users/entities/user.entity';
import { CreateVehicleDto } from './dto/create-vehicle.dto';

@Injectable()
export class VehiclesService {
  constructor(
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(query: {
    categoria?: string;
    condicion?: string;
    destacado?: string;
    search?: string;
  }) {
    const where: any = {};

    if (query.categoria) {
      where.categoria = query.categoria;
    }
    if (query.condicion) {
      where.condicion = query.condicion;
    }
    if (query.destacado) {
      where.destacado = query.destacado === 'true';
    }

    const relations = {
      autoDetail: true,
      motoDetail: true,
      maquinariaDetail: true,
      especificaciones: { grupo: true },
    };

    if (query.search) {
      const searchPattern = Like(`%${query.search}%`);
      return this.vehicleRepository.find({
        where: [
          { ...where, nombre: searchPattern },
          { ...where, marca: searchPattern },
          { ...where, modelo: searchPattern },
        ],
        relations,
        order: { fechaIngreso: 'DESC' },
      });
    }

    return this.vehicleRepository.find({
      where,
      relations,
      order: { fechaIngreso: 'DESC' },
    });
  }

  async findMyListings(userId: string) {
    return this.vehicleRepository.find({
      where: { userId },
      relations: {
        autoDetail: true,
        motoDetail: true,
        maquinariaDetail: true,
        especificaciones: { grupo: true },
      },
      order: { fechaIngreso: 'DESC' },
    });
  }

  async findOne(id: string) {
    const vehicle = await this.vehicleRepository.findOne({
      where: { id },
      relations: {
        autoDetail: true,
        motoDetail: true,
        maquinariaDetail: true,
        especificaciones: { grupo: true },
      },
    });
    if (!vehicle) {
      throw new NotFoundException(`Vehículo con id ${id} no encontrado.`);
    }
    return vehicle;
  }

  async create(createVehicleDto: CreateVehicleDto, creator: any) {
    // Validar cuotas del usuario
    const dbUser = await this.userRepository.findOne({ where: { id: creator.id } });
    if (!dbUser) {
      throw new NotFoundException('Usuario creador no encontrado.');
    }

    if (dbUser.rol === 'cliente') {
      const activeCount = await this.vehicleRepository.count({
        where: { userId: dbUser.id }
      });
      
      let limit = 2;
      if (dbUser.plan === 'negocio') limit = 60;
      if (dbUser.plan === 'empresa') limit = 300;

      if (activeCount >= limit) {
        throw new BadRequestException(`Límite de publicaciones alcanzado. Tu plan actual (${dbUser.plan}) permite un máximo de ${limit} publicaciones activas.`);
      }


    }

    const id = `${createVehicleDto.categoria}-${Date.now()}`;
    const fechaIngreso = new Date().toISOString().split('T')[0];

    const { autoDetail, motoDetail, maquinariaDetail, especificaciones, ...baseData } = createVehicleDto;
    
    const vehicle = this.vehicleRepository.create({
      ...baseData,
      id,
      fechaIngreso,
      userId: dbUser.rol === 'admin' ? null : dbUser.id,
      especificaciones: [],
    });

    if (especificaciones && especificaciones.length > 0) {
      const specs = await this.specificationRepository.find({
        where: { id: In(especificaciones) },
      });
      vehicle.especificaciones = specs;
    }

    const savedVehicle = await this.vehicleRepository.save(vehicle);

    if (createVehicleDto.categoria === 'autos' && autoDetail) {
      const detail = this.autoRepository.create({
        ...autoDetail,
        id: savedVehicle.id,
      });
      await this.autoRepository.save(detail);
    } else if (createVehicleDto.categoria === 'motos' && motoDetail) {
      const detail = this.motoRepository.create({
        ...motoDetail,
        id: savedVehicle.id,
      });
      await this.motoRepository.save(detail);
    } else if (createVehicleDto.categoria === 'maquinaria' && maquinariaDetail) {
      const detail = this.maquinariaRepository.create({
        ...maquinariaDetail,
        id: savedVehicle.id,
      });
      await this.maquinariaRepository.save(detail);
    }

    return this.findOne(savedVehicle.id);
  }

  async update(id: string, updateVehicleDto: any, user?: any) {
    const vehicle = await this.findOne(id);

    // Verificar propiedad si no es admin y se proporciona el usuario
    if (user && user.rol !== 'admin' && vehicle.userId !== user.id) {
      throw new ForbiddenException('No tienes permiso para modificar esta publicación.');
    }



    const { autoDetail, motoDetail, maquinariaDetail, especificaciones, ...baseData } = updateVehicleDto;

    Object.assign(vehicle, baseData);

    if (especificaciones !== undefined) {
      if (especificaciones.length > 0) {
        const specs = await this.specificationRepository.find({
          where: { id: In(especificaciones) },
        });
        vehicle.especificaciones = specs;
      } else {
        vehicle.especificaciones = [];
      }
    }

    const savedVehicle = await this.vehicleRepository.save(vehicle);

    if (savedVehicle.categoria === 'autos' && autoDetail) {
      const detail = await this.autoRepository.findOne({ where: { id } });
      if (detail) {
        Object.assign(detail, autoDetail);
        await this.autoRepository.save(detail);
      } else {
        const newDetail = this.autoRepository.create({
          id,
          carroceria: autoDetail.carroceria,
          puertas: Number(autoDetail.puertas),
          pasajeros: Number(autoDetail.pasajeros)
        } as any);
        await this.autoRepository.save(newDetail);
      }
    } else if (savedVehicle.categoria === 'motos' && motoDetail) {
      const detail = await this.motoRepository.findOne({ where: { id } });
      if (detail) {
        Object.assign(detail, motoDetail);
        await this.motoRepository.save(detail);
      } else {
        const newDetail = this.motoRepository.create({
          id,
          cilindrada: Number(motoDetail.cilindrada),
          tipoMoto: motoDetail.tipoMoto
        } as any);
        await this.motoRepository.save(newDetail);
      }
    } else if (savedVehicle.categoria === 'maquinaria' && maquinariaDetail) {
      const detail = await this.maquinariaRepository.findOne({ where: { id } });
      if (detail) {
        Object.assign(detail, maquinariaDetail);
        await this.maquinariaRepository.save(detail);
      } else {
        const newDetail = this.maquinariaRepository.create({
          id,
          pesoOperativo: Number(maquinariaDetail.pesoOperativo),
          horasUso: Number(maquinariaDetail.horasUso)
        } as any);
        await this.maquinariaRepository.save(newDetail);
      }
    }

    return this.findOne(savedVehicle.id);
  }

  async remove(id: string, user?: any) {
    const vehicle = await this.findOne(id);

    // Verificar propiedad si no es admin y se proporciona el usuario
    if (user && user.rol !== 'admin' && vehicle.userId !== user.id) {
      throw new ForbiddenException('No tienes permiso para eliminar esta publicación.');
    }

    await this.vehicleRepository.remove(vehicle);
    return { message: `Vehículo con id ${id} eliminado exitosamente.` };
  }
}
