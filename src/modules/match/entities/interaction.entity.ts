import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../shared/entities/abstract-entity";
import { User } from "../../users/entities/user.entity";

@Entity('interactions')
export class Interaction extends AbstractEntity {

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @ManyToOne(() => User)
  interactedWith: User;

  @Column({ type: 'enum', enum: ['like', 'dislike'] })
  interactionType: 'like' | 'dislike';
}