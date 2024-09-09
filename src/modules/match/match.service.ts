import { BadRequestException, Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AppDataSource } from '../../config/db.config';

@Injectable()
export class MatchService extends BasicService<Match> {
  constructor(@InjectRepository(Match) private matchRepo: Repository<Match>) {
    super(matchRepo, 'Match');
  }

  async getMatches(user: User) {
    return this.matchRepo.find({
      where: { userId: user.id },
    });
  }

  async getPotentialMatches(user: User) {
    // check if the user has already been matched
    const checkMatches = await this.matchRepo.find({
      where: { userId: user.id },
    });

    if (checkMatches.length) {
      return checkMatches;
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
      `SELECT * FROM profiles WHERE interests && '{${interests.join(',')}}'`,
    );

    // get similar age preferences
    const similarAgePreferences = await AppDataSource.query(
      `SELECT * FROM profiles WHERE agePreference && '{${agePreference.join(',')}}'`,
    );

    // get children preferences match
    const similarChildrenPreferences = await AppDataSource.query(
        `SELECT * FROM profiles WHERE children = '${childrenPreference}'`,
    );

    // get faith matters match
    const similarFaithMatters = await AppDataSource.query(
        `SELECT * FROM profiles WHERE doesFaithMatter = '${doesFaithMatter}'`,
    );

    // get cultural values match
    const similarCulturalValues = await AppDataSource.query(
        `SELECT * FROM profiles WHERE matchCulturalValues && '{${culturalValuesPreference.join(',')}}'`,
    );

    // get languages match
    const similarLanguages = await AppDataSource.query(
        `SELECT * FROM profiles WHERE languages && '{${languagesPreference.join(',')}}'`,
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
        if (potentialMatchesMap.has(match.id)) {
            potentialMatchesMap.set(match.id, potentialMatchesMap.get(match.id) + 1);
        } else {
            potentialMatchesMap.set(match.id, 1);
        }
    });

    const sortedPotentialMatches = [...potentialMatchesMap.entries()].sort((a, b) => b[1] - a[1]);

    const matches = sortedPotentialMatches.map(([id]) => id);

    // create the top 3 matches
    const top3Matches = matches.slice(0, 3);
    const data = this.matchRepo.create(top3Matches.map((id) => ({ userId: user.id, matchId: id })));
    const result = await this.matchRepo.save(data);

    return result;
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
