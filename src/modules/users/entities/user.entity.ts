import {
  AfterLoad,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { classToPlain, Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { AbstractEntity } from '../../../shared/entities/abstract-entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Subscription } from 'rxjs';
import { Feedback } from '../../feedback/entities/feedback.entity';

@Entity('users')
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  // @Column({ unique: true })
  // phoneNumber: string;

  @Exclude()
  @Column()
  password: string;

  @ManyToOne(() => Role, (role) => role.users, { eager: true })
  @JoinColumn()
  role: Role;

  @Column({ nullable: true })
  roleId: string;

  @Column({ default: true })
  status: boolean;

  @Column({ default: 'Canada' })
  country: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ default: false })
  phoneNumberVerified: boolean;

  @OneToOne(() => Profile, (profile) => profile.user)
  profile: Profile;

  @OneToMany(() => Feedback, (feedback) => feedback.user)
  feedbacks: Feedback[];

  protected verified: boolean;

  @BeforeInsert()
  async handleBeforeInsert() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @AfterLoad()
  handleAfterLoad() {
    this.verified = this.emailVerified || this.phoneNumberVerified;
  }

  async comparePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }
}
