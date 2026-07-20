import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Specification } from './entities/specification.entity';
import { SpecificationGroup } from './entities/specification-group.entity';
import { CreateGroupDto, CreateSpecificationDto } from './dto/create-spec.dto';

@Injectable()
export class SpecificationsService {
  constructor(
    @InjectRepository(Specification)
    private readonly specRepository: Repository<Specification>,
    @InjectRepository(SpecificationGroup)
    private readonly groupRepository: Repository<SpecificationGroup>,
  ) {}

  async createGroup(createGroupDto: CreateGroupDto) {
    const existing = await this.groupRepository.findOne({ where: { nombre: createGroupDto.nombre } });
    if (existing) {
      throw new BadRequestException(`El grupo "${createGroupDto.nombre}" ya existe.`);
    }
    const group = this.groupRepository.create(createGroupDto);
    return this.groupRepository.save(group);
  }

  async findAllGroups() {
    return this.groupRepository.find({
      relations: { especificaciones: true },
      order: { nombre: 'ASC' },
    });
  }

  async findGroupById(id: number) {
    const group = await this.groupRepository.findOne({ where: { id }, relations: { especificaciones: true } });
    if (!group) {
      throw new NotFoundException(`Grupo de especificaciones con id ${id} no encontrado.`);
    }
    return group;
  }

  async createSpec(createSpecDto: CreateSpecificationDto) {
    await this.findGroupById(createSpecDto.grupoId);
    
    const existing = await this.specRepository.findOne({ where: { nombre: createSpecDto.nombre } });
    if (existing) {
      throw new BadRequestException(`La especificación "${createSpecDto.nombre}" ya existe.`);
    }

    const spec = this.specRepository.create({
      nombre: createSpecDto.nombre,
      grupoId: createSpecDto.grupoId,
    });
    return this.specRepository.save(spec);
  }

  async findAllSpecs() {
    return this.specRepository.find({
      relations: { grupo: true },
      order: { nombre: 'ASC' },
    });
  }

  async findSpecById(id: number) {
    const spec = await this.specRepository.findOne({ where: { id }, relations: { grupo: true } });
    if (!spec) {
      throw new NotFoundException(`Especificación con id ${id} no encontrada.`);
    }
    return spec;
  }
}
