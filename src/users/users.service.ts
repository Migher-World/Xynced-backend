import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesService } from '../roles/roles.service';
import { AbstractService } from '../shared/services/abstract-service.service';
import { AssignRoleDto } from './dto/assign-role.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService extends AbstractService<User> {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>, // private jwtService: JwtService,
    private readonly rolesService: RolesService,
  ) {
    super();
    this.repository = this.userRepo;
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const { firstName, lastName, email, telephone } = createUserDto;
      const password = this.randPassword(6, 3, 2);
      const payload = {
        firstName,
        lastName,
        email,
        telephone,
        password,
      };
      const response = this.userRepo.create(payload);
      console.log('password is ', password);
      const user = await this.userRepo.save(response);
      return user.toJSON();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Email has already been taken');
      }
      throw error;
    }
  }

  private randPassword(letters: number, numbers: number, either: number) {
    const chars = [
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', // letters
      '0123456789', // numbers
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // either
    ];

    return [letters, numbers, either]
      .map(function (len, i) {
        return Array(len)
          .fill(chars[i])
          .map(function (x) {
            return x[Math.floor(Math.random() * x.length)];
          })
          .join('');
      })
      .concat()
      .join('')
      .split('')
      .sort(function () {
        return 0.5 - Math.random();
      })
      .join('');
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
