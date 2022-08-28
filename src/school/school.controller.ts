import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { SchoolService } from './school.service';
import { CreateSchoolDto } from './dto/create-school.dto';
import { CurrentAdmin } from '../auth/decorators/current-admin.decorator';
import { Admin } from '../entities/admin.entity';
import { JwtAdminGuard } from '../auth/jwt/jwt-admin.guard';
@Controller('school')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @UseGuards(JwtAdminGuard)
  @Post()
  createSchool(
    @Body() createSchoolDto: CreateSchoolDto,
    @CurrentAdmin() admin: Admin,
  ) {
    return this.schoolService.createSchool(createSchoolDto, admin);
  }
}
