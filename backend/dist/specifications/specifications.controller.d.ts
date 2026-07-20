import { SpecificationsService } from './specifications.service';
import { CreateGroupDto, CreateSpecificationDto } from './dto/create-spec.dto';
export declare class SpecificationsController {
    private readonly specsService;
    constructor(specsService: SpecificationsService);
    findAllGroups(): Promise<import("./entities/specification-group.entity").SpecificationGroup[]>;
    findAllSpecs(): Promise<import("./entities/specification.entity").Specification[]>;
    createGroup(createGroupDto: CreateGroupDto): Promise<import("./entities/specification-group.entity").SpecificationGroup>;
    createSpec(createSpecDto: CreateSpecificationDto): Promise<import("./entities/specification.entity").Specification>;
}
