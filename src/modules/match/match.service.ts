import { BadRequestException, Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AppDataSource } from '../../config/db.config';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class MatchService extends BasicService<Match> {
  constructor(@InjectRepository(Match) private matchRepo: Repository<Match>) {
    super(matchRepo, 'Match');
  }

  async getMatches(user: User) {
    // return this.matchRepo.find({
    //   where: { userId: user.id },
    //   select: ['matchedUserId', 'isAccepted', 'isRejected'],
    //   relations: {
    //     matchedUser: {
    //       profile: {
    //         fullName: true
    //       }
    //     }
    //   }
    // });
    const query = this.matchRepo.createQueryBuilder('match')
      .where('match.userId = :userId', { userId: user.id })
      .andWhere('match.isRejected = false')
      .select(['match.matchedUserId', 'match.isAccepted', 'match.isRejected'])
      .leftJoinAndSelect('match.matchedUser', 'matchedUser')
      .leftJoinAndSelect('matchedUser.profile', 'profile')
      .addSelect(['profile.fullName', 'profile.age', 'profile.bio', 'profile.profilePicture']);

    return query.getMany();
  }

  async getPotentialMatches(user: User) {
    // check if the user has already been matched
    const checkMatches = await this.getMatches(user);

    if (checkMatches.length) {
      return checkMatches.slice(0, 3);
    }

    const profile = user.profile;
    const interests = profile.interests;
    const agePreference = profile.agePreference;
    const childrenPreference = profile.children;
    // const genderPreference = profile.gender;
    const doesFaithMatter = profile.doesFaithMatter;
    const culturalValuesPreference = profile.matchCulturalValues;
    const languagesPreference = profile.languages;

    // get similar interests
    const similarInterests = await AppDataSource.query(
      `SELECT * FROM profile WHERE "interests" && ARRAY[${interests.map((interest) => `'${interest}'`)}]`,
    );

    // get similar age preferences
    const similarAgePreferences = await AppDataSource.query(
      `SELECT * FROM profile WHERE "age" BETWEEN ${agePreference[0]} AND ${agePreference[1]}`,
    );

    // get children preferences match
    const similarChildrenPreferences = await AppDataSource.query(
        `SELECT * FROM profile WHERE "children" = '${childrenPreference}'`,
    );

    // get faith matters match
    const similarFaithMatters = await AppDataSource.query(
        `SELECT * FROM profile WHERE "doesFaithMatter" = '${doesFaithMatter}'`,
    );

    // get cultural values match
    const similarCulturalValues = await AppDataSource.query(
        `SELECT * FROM profile WHERE "matchCulturalValues" && ARRAY[${culturalValuesPreference.map((culturalValue) => `'${culturalValue}'`)}]`,
    );

    // get languages match
    const similarLanguages = await AppDataSource.query(
        `SELECT * FROM profile WHERE "languages" && ARRAY[${languagesPreference.map((language) => `'${language}'`)}]`,
    );

    // get most closest match based on the above queries, i.e the user with the most similar interests, age preferences, etc

    const potentialMatches = [
        ...similarInterests,
        ...similarAgePreferences,
        ...similarChildrenPreferences,
        ...similarFaithMatters,
        ...similarCulturalValues,
        ...similarLanguages,
    ];

    const potentialMatchesMap = new Map();
    potentialMatches.forEach((match) => {
        if (potentialMatchesMap.has(match.userId)) {
            potentialMatchesMap.set(match.userId, potentialMatchesMap.get(match.userId) + 1);
        } else {
            potentialMatchesMap.set(match.userId, 1);
        }
    });

    const sortedPotentialMatches = [...potentialMatchesMap.entries()].sort((a, b) => b[1] - a[1]);

    const matches = sortedPotentialMatches.map(([id]) => id);

    // create the top 3 matches
    const top3Matches = matches.slice(0, 3);
    const data = this.matchRepo.create(top3Matches.map((id) => ({ userId: user.id, matchedUserId: id })));
    await this.matchRepo.save(data);

    return this.getMatches(user);
  }

  async acceptMatch(user: User, matchId: string) {
    const match = await this.matchRepo.findOne({ where: { userId: user.id, matchedUserId: matchId } });
    if (!match) {
      throw new BadRequestException('Match not found');
    }

    match.isAccepted = true;
    match.isRejected = false;
    await this.matchRepo.save(match);
    return match;
  }

  async declineMatch(user: User, matchId: string) {
    const match = await this.matchRepo.findOne({ where: { userId: user.id, matchedUserId: matchId } });
    if (!match) {
      throw new BadRequestException('Match not found');
    }

    match.isRejected = true;
    match.isAccepted = false; 
    await this.matchRepo.save(match);
    return match;
  }
}
