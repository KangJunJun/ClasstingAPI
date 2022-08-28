import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { School } from '../entities/school.entity';
import { Admin } from '../entities/admin.entity';
import { CreateSchoolDto } from './dto/create-school.dto';

@Injectable()
export class SchoolService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepository: Repository<School>,
  ) {}

  public async createSchool(createSchoolDto: CreateSchoolDto, admin: Admin) {
    const existSchool = await this.schoolRepository.findOne({
      where: {
        name: createSchoolDto.name,
        region: createSchoolDto.region,
      },
    });

    const existResister = await this.schoolRepository.findOne({
      where: { admin: { id: admin?.id } },
    });

    if (existSchool) {
      throw new HttpException(
        'This School has already been used.',
        HttpStatus.CONFLICT,
      );
    }

    if (existResister) {
      throw new HttpException(
        'This administrator has already registered the school.',
        HttpStatus.CONFLICT,
      );
    }

    const school = await this.schoolRepository.create({
      ...createSchoolDto,
      admin,
    });

    await this.schoolRepository.save(school);
    delete school.admin;

    return school;
  }

  public async getSchool(id: number) {
    const school = await this.schoolRepository.findOne({
      where: { id },
    });

    if (!school) {
      throw new HttpException(
        'This school does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return school;
  }
}
