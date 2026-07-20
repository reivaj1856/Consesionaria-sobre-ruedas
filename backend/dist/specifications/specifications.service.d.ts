import { Repository } from 'typeorm';
import { Specification } from './entities/specification.entity';
import { SpecificationGroup } from './entities/specification-group.entity';
import { CreateGroupDto, CreateSpecificationDto } from './dto/create-spec.dto';
export declare class SpecificationsService {
    private readonly specRepository;
    private readonly groupRepository;
    constructor(specRepository: Repository<Specification>, groupRepository: Repository<SpecificationGroup>);
    createGroup(createGroupDto: CreateGroupDto): Promise<SpecificationGroup>;
    findAllGroups(): Promise<SpecificationGroup[]>;
    findGroupById(id: number): Promise<SpecificationGroup>;
    createSpec(createSpecDto: CreateSpecificationDto): Promise<Specification>;
    findAllSpecs(): Promise<Specification[]>;
    findSpecById(id: number): Promise<Specification>;
}
