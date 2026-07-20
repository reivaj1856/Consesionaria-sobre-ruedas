import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { SpecificationsService } from './specifications.service';
import { CreateGroupDto, CreateSpecificationDto } from './dto/create-spec.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('specifications')
export class SpecificationsController {
  constructor(private readonly specsService: SpecificationsService) {}

  @Get('groups')
  async findAllGroups() {
    return this.specsService.findAllGroups();
  }

  @Get()
  async findAllSpecs() {
    return this.specsService.findAllSpecs();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post('groups')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.specsService.createGroup(createGroupDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  async createSpec(@Body() createSpecDto: CreateSpecificationDto) {
    return this.specsService.createSpec(createSpecDto);
  }
}
