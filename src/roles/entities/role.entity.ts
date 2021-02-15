import { Permission } from './../../permissions/entities/permission.entity';
import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractEntity } from '../../shared/entities/abstract-entity';
import { generateSlug } from '../../utils/functions';
import { User } from '../../users/entities/user.entity';

@Entity('roles')
export class Role extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  slug: string;

  @Column('text')
  description: string;

  @OneToMany(() => User, (user) => user.role)
  users: User[];

  @ManyToMany(() => Permission, (permission) => permission.roles, {
    eager: true,
  })
  @JoinTable()
  permissions: Permission[];

  @BeforeInsert()
  slugify() {
    this.slug = generateSlug(this.name);
  }
}
