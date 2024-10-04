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
import { CreateNotificationDto } from '../../shared/alerts/notifications/dto/create-notification.dto';
import { NotificationTypes } from '../../shared/alerts/notifications/enum/notification-types.enum';

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
        'match.userId',
      ])
      .leftJoinAndSelect('match.matchedUser', 'matchedUser')
      .leftJoinAndSelect('match.user', 'user')
      .leftJoin('user.profile', 'userProfile')
      .leftJoin('matchedUser.profile', 'profile')
      .addSelect([
        'profile.fullName',
        'profile.age',
        'profile.bio',
        'profile.profilePicture',
        'profile.city',
        'profile.pictures',
        'profile.interests',
        'userProfile.fullName',
        'userProfile.age',
        'userProfile.bio',
        'userProfile.profilePicture',
        'userProfile.city',
        'userProfile.pictures',
        'userProfile.interests',
      ]);

    const data = await query.getMany();
    // get shared interests
    const result = data.map((match) => {
      const sharedInterests = userProfile.interests.filter((interest) =>
        match.matchedUser.profile.interests.includes(interest),
      );
      if(user.id === match.matchedUserId){
        const temp = match.user;
        const tempUserAccepted = match.userAccepted;
        match.userAccepted = match.matchAccepted;
        match.user = match.matchedUser;
        match.matchedUser = temp;
        match.matchAccepted = tempUserAccepted;
      }

      // let accepted be true if the other user has accepted the match

      return { ...match, sharedInterests };
    });

    return result;
  }

  async getMatchById(user: User, matchId: string) {
    const query = this.matchRepo
      .createQueryBuilder('match')
      .where('match.id = :id', { id: matchId })
      .andWhere('match.userId = :userId', { userId: user.id })
      .orWhere('match.matchedUserId = :userId', { userId: user.id })
      .leftJoinAndSelect('match.matchedUser', 'matchedUser')
      .leftJoinAndSelect('match.user', 'user')
      .leftJoin('matchedUser.profile', 'profile')
      .leftJoin('user.profile', 'userProfile')
      .addSelect([
        'profile.fullName',
        'profile.age',
        'profile.bio',
        'profile.profilePicture',
        'profile.city',
        'profile.pictures',
        'profile.interests',
        'userProfile.fullName',
        'userProfile.age',
        'userProfile.bio',
        'userProfile.profilePicture',
        'userProfile.city',
        'userProfile.pictures',
        'userProfile.interests',
      ]);

    const match = await query.getOne();
    if (!match) {
      throw new BadRequestException('Match not found');
    }

    if(user.id === match.matchedUserId){
      const temp = match.user;
      const tempUserAccepted = match.userAccepted;
      match.userAccepted = match.matchAccepted;
      match.user = match.matchedUser;
      match.matchedUser = temp;
      match.matchAccepted = tempUserAccepted;
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

    // ensure that the user is not matched with themselves
    potentialMatchesMap.delete(user.id);

    // add percentage match to each user based on the preferences and should not be more than 100%
    const percentageMatchMap = new Map();

    potentialMatchesMap.forEach((value, key) => {
      const percentageMatch = Math.floor((value / 6) * 100);
      percentageMatchMap.set(key, percentageMatch);
    });

    const sortedPotentialMatches = [...potentialMatchesMap.entries()].sort((a, b) => b[1] - a[1]);

    let matches = sortedPotentialMatches.map(([id]) => id);

    // check if user has reshuffled and remove previously matched users
    const matchedUsersString = await this.cacheService.get(`xyncedMatch:matched-${user.id}`);
    const matchedUsers = matchedUsersString ? JSON.parse(matchedUsersString) : null;
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
    // check if user already has a match
    const userMatches = await this.getMatches(user);
    if(userMatches.find(match => match.userAccepted && match.matchAccepted && !match.isRejected)) {
      throw new BadRequestException('You already have a match');
    }

    const match = await this.findOne(matchId);
    
    // check if user already accepted the match
    if (user.id === match.userId && match.userAccepted) {
      throw new BadRequestException('You have already accepted this match');
    }

    if (![match.userId, match.matchedUserId].includes(user.id)) {
      throw new BadRequestException('Match not found');
    }

    if (match.isRejected) {
      throw new BadRequestException('Match has been rejected');
    }

    user.id === match.userId ? match.userAccepted = true : match.matchAccepted = true;

    match.isRejected = false;
    await this.matchRepo.save(match);
    if (match.userAccepted && match.matchAccepted) {
      this.eventEmitter.emit(AppEvents.MATCH_ACCEPTED, {
        matchId,
        user,
      });
    }
    this.cacheService.set(`xyncedMatch:cannot-reshuffle-${user.id}`, 'true', null);
    const notification: CreateNotificationDto = {
      type: NotificationTypes.MATCH_ACCEPTED,
      createdById: user.id,
      createdForId: [match.userId, match.matchedUserId].find((id) => id !== user.id),
      recordId: matchId,
      metaData: {},
    }
    this.eventEmitter.emit(AppEvents.CREATE_NOTIFICATION, notification);
    return match;
  }

  async reshuffleMatches(user: User) {
    // check if user has reshuffled
    const cannotReshuffle = await this.cacheService.get(`xyncedMatch:cannot-reshuffle-${user.id}`);
    if (cannotReshuffle) {
      throw new BadRequestException('You have already reshuffled your matches');
    }
    const matches = await this.matchRepo.find({ where: { userId: user.id } });
    await this.matchRepo.remove(matches);
    // store that user has reshuffled
    this.cacheService.set(`xyncedMatch:cannot-reshuffle-${user.id}`, 'true', null);
    // store matched users
    const matchedUsers = matches.map((match) => match.matchedUserId);
    this.cacheService.set(`xyncedMatch:matched-${user.id}`, JSON.stringify(matchedUsers), null);
    return this.getPotentialMatches(user);
  }

  async declineMatch(user: User, matchId: string) {
    const match = await this.findOne(matchId);
    if (![match.userId, match.matchedUserId].includes(user.id)) {
      throw new BadRequestException('Match not found');
    }

    match.isRejected = true;
    await this.matchRepo.save(match);
    this.cacheService.set(`xyncedMatch:cannot-reshuffle-${user.id}`, 'true', null);
    // add matched user to cache
    const matchedUsersString = await this.cacheService.get(`xyncedMatch:matched-${user.id}`);
    const matchedUsers = matchedUsersString ? JSON.parse(matchedUsersString) : [];
    matchedUsers.push(match.matchedUserId);
    this.cacheService.set(`xyncedMatch:matched-${user.id}`, JSON.stringify(matchedUsers), null);
    const notification: CreateNotificationDto = {
      type: NotificationTypes.MATCH_DECLINED,
      createdById: user.id,
      createdForId: [match.userId, match.matchedUserId].find((id) => id !== user.id),
      recordId: matchId,
      metaData: {},
    }
    this.eventEmitter.emit(AppEvents.CREATE_NOTIFICATION, notification);
    return match;
  }

  async canReshuffle(user: User) {
    const cannotReshuffle = await this.cacheService.get(`xyncedMatch:cannot-reshuffle-${user.id}`);
    return !cannotReshuffle;
  }
}

