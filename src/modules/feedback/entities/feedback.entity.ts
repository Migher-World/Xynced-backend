import { Column, Entity, ManyToOne } from "typeorm";
import { AbstractEntity } from "../../../shared/entities/abstract-entity";
import { User } from "../../users/entities/user.entity";

@Entity('feedbacks')
export class Feedback extends AbstractEntity {
    @Column()
    userId: string;

    @Column()
    matchId: string;

    @ManyToOne(() => User)
    user: User;

    @Column()
    feedback: string;

    @Column()
    rating: number;
}