import { BadRequestException, Injectable } from '@nestjs/common';
import { BasicService } from '../../shared/services/basic-service.service';
import { Match } from './entities/match.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AppDataSource } from '../../config/db.config';
import { Profile } from '../profile/entities/profile.entity';
import { CacheService } from '../cache/cache.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AppEvents } from '../../constants';

@Injectable()
export class MatchService extends BasicService<Match> {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    private cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
  ) {
    super(matchRepo, 'Match');
  }

  async getMatches(user: User) {
    const userProfile = user.profile;
    const query = this.matchRepo
      .createQueryBuilder('match')
      .where('match.userId = :userId', { userId: user.id })
      .orWhere('match.matchedUserId = :userId', { userId: user.id })
      .andWhere('match.isRejected = false')
      .select([
        'match.matchedUserId',
        'match.userAccepted',
        'match.matchAccepted',
        'match.isRejected',
        'match.percentage',
        'match.id',
      ])
      .leftJoinAndSelect('match.matchedUser', 'matchedUser')
      .leftJoin('matchedUser.profile', 'profile')
      .addSelect([
        'profile.fullName',
        'profile.age',
        'profile.bio',
        'profile.profilePicture',
        'profile.city',
        'profile.pictures',
        'profile.interests',
      ]);

    const data = await query.getMany();
    // get shared interests
    const result = data.map((match) => {
      const sharedInterests = userProfile.interests.filter((interest) =>
        match.matchedUser.profile.interests.includes(interest),
      );
      return { ...match, sharedInterests };
    });

    return result;
  }

  async getMatchById(user: User, matchId: string) {
    const query = this.matchRepo
      .createQueryBuilder('match')
      .where('match.id = :id', { id: matchId })
      .andWhere('match.userId = :userId', { userId: user.id })
      .leftJoinAndSelect('match.matchedUser', 'matchedUser')
      .leftJoin('matchedUser.profile', 'profile')
      .addSelect([
        'profile.fullName',
        'profile.age',
        'profile.bio',
        'profile.profilePicture',
        'profile.city',
        'profile.pictures',
        'profile.interests',
      ])
      .getOne();

    const match = await query;
    if (!match) {
      throw new BadRequestException('Match not found');
    }

    const result = {
      ...match,
      sharedInterests: user.profile.interests.filter((interest) =>
        match.matchedUser.profile.interests.includes(interest),
      ),
    };

    return result;
  }

  async getPotentialMatches(user: User) {
    // check if the user has already been matched
    const checkMatches = await this.getMatches(user);

    if (checkMatches.length >= 3) {
      return checkMatches.slice(0, 3);
    }

    const matchesLeft = 3 - checkMatches.length;

    const profile = user.profile;
    const interests = profile.interests;
    const agePreference = profile.agePreference;
    const childrenPreference = profile.children;
    // const genderPreference = profile.gender;
    const doesFaithMatter = profile.doesFaithMatter;
    const culturalValuesPreference = profile.matchCulturalValues;
    const languagesPreference = profile.languages;

    // if any of the preferences are not set, return an error
    if (
      !interests ||
      !agePreference ||
      !childrenPreference ||
      !doesFaithMatter ||
      !culturalValuesPreference ||
      !languagesPreference
    ) {
      throw new BadRequestException(
        'Please set your preferences to get matches. To set your preferences, go to your profile',
      );
    }

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
      `SELECT * FROM profile WHERE "matchCulturalValues" && ARRAY[${culturalValuesPreference.map(
        (culturalValue) => `'${culturalValue}'`,
      )}]`,
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
      const id = match.userId;
      if (potentialMatchesMap.has(id)) {
        potentialMatchesMap.set(id, potentialMatchesMap.get(id) + 1);
      } else {
        potentialMatchesMap.set(id, 1);
      }
    });

    // add percentage match to each user based on the preferences and should not be more than 100%
    const percentageMatchMap = new Map();

    potentialMatchesMap.forEach((value, key) => {
      const percentageMatch = Math.floor((value / 6) * 100);
      percentageMatchMap.set(key, percentageMatch);
    });

    const sortedPotentialMatches = [...potentialMatchesMap.entries()].sort((a, b) => b[1] - a[1]);

    let matches = sortedPotentialMatches.map(([id]) => id);

    // check if user has reshuffled and remove previously matched users
    const matchedUsers = await this.cacheService.get(`matched-${user.id}`);
    if (matchedUsers) {
      const filteredMatches = matches.filter((id) => !matchedUsers.includes(id));
      matches = filteredMatches;
    }

    // create the matches left
    const topMatches = matches.slice(0, matchesLeft);
    const data = this.matchRepo.create(
      topMatches.map((id) => ({ userId: user.id, matchedUserId: id, percentage: percentageMatchMap.get(id) })),
    );
    await this.matchRepo.save(data);

    return this.getMatches(user);
  }

  async acceptMatch(user: User, matchId: string) {
    const match = await this.findOne(matchId);

    if (![match.userId, match.matchedUserId].includes(user.id)) {
      throw new BadRequestException('Match not found');
    }

    if (match.isRejected) {
      throw new BadRequestException('Match has been rejected');
    }

    user.id === match.userId ? (match.userAccepted = true) : (match.matchAccepted = true);

    match.isRejected = false;
    await this.matchRepo.save(match);
    if (match.userAccepted && match.matchAccepted) {
      this.eventEmitter.emit(AppEvents.MATCH_ACCEPTED, {
        matchId,
        user,
      });
    }
    return match;
  }

  async reshuffleMatches(user: User) {
    // check if user has reshuffled
    const reshuffled = await this.cacheService.get(`reshuffled-${user.id}`);
    if (reshuffled) {
      throw new BadRequestException('You have already reshuffled your matches');
    }
    const matches = await this.matchRepo.find({ where: { userId: user.id } });
    await this.matchRepo.remove(matches);
    // store that user has reshuffled
    await this.cacheService.set(`reshuffled-${user.id}`, true, null);
    // store matched users
    const matchedUsers = matches.map((match) => match.matchedUserId);
    await this.cacheService.set(`matched-${user.id}`, matchedUsers, null);
    return this.getPotentialMatches(user);
  }

  async declineMatch(user: User, matchId: string) {
    const match = await this.matchRepo.findOne({ where: { userId: user.id, matchedUserId: matchId } });
    if (!match) {
      throw new BadRequestException('Match not found');
    }

    match.isRejected = true;
    await this.matchRepo.save(match);
    return match;
  }
}
