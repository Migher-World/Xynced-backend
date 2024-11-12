import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Helper } from '../../shared/helpers';
import { BasicService } from '../../shared/services/basic-service.service';
import { RolesService } from '../roles/roles.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { AbstractPaginationDto } from '../../shared/dto/abstract-pagination.dto';
import { AssignRoleDto } from './dto/assign-role.dto';

@Injectable()
export class UsersService extends BasicService<User> {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>, // private jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {
    super(userRepo, 'Users');
  }

  async checkDuplicate(user: Partial<User>) {
    const { email } = user;
    const isEmailExist = await this.userRepo.findOne({ where: { email } });
    // const isTelephoneExist = await this.userRepo.findOne({
    //   where: { phoneNumber },
    // });

    // if (isEmailExist && isTelephoneExist) {
    //   throw new BadRequestException('Email and phone number already exists');
    // }

    if (isEmailExist) {
      throw new BadRequestException('Email exists');
    }

    // if (isTelephoneExist) {
    //   throw new BadRequestException('Phone number exists');
    // }
  }

  async findAll(pagination: AbstractPaginationDto) {
    const query = this.userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile', 'profile')
    .leftJoinAndSelect('user.feedbacks', 'feedbacks')

    return this.paginate(query, pagination);
  }

  async findOneUser(id: string) {
    const query = this.userRepo.createQueryBuilder('user')
    .leftJoinAndSelect('user.profile', 'profile')
    .leftJoinAndSelect('user.feedbacks', 'feedbacks')
    .where('user.id = :id', { id });

    return query.getOne();
  }

  async create(createUserDto: CreateUserDto) {
    let { password } = createUserDto;

    await this.checkDuplicate(createUserDto);

    if (!password) {
      password = Helper.randPassword(3, 2, 6);
    }

    const response = this.userRepo.create({ ...createUserDto, password });

    const user = await this.userRepo.save(response);
    return user;
  }

  async getUserOverview() {
    // a graph of users created per month
    const query = this.userRepo.createQueryBuilder('user')
    .select('COUNT(user.id)', 'count')
    .addSelect('TO_CHAR(DATE_TRUNC(\'month\', user.createdAt), \'Mon\')', 'month')
    .groupBy('month');

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const data = await query.getRawMany();
    const result = [];

    for (const month of months) {
      const monthData = data.find((d) => d.month === month);
      if (monthData) {
        result.push(monthData);
      } else {
        result.push({ month: month, count: "0" });
      }
    }
    return result;
  }

  async assignRole(assignRoleDto: AssignRoleDto) {
    const { userId, roleId } = assignRoleDto;
    const user = await this.findOne(userId);
    const role = await this.rolesService.findOne(roleId);
    user.role = role;
    await user.save();
    return user;
  }
}
