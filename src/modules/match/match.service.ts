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
import { FeedbackService } from '../feedback/feedback.service';
import { FeedbackDto } from '../feedback/dto/feedback.dto';

@Injectable()
export class MatchService extends BasicService<Match> {
  constructor(
    @InjectRepository(Match) private matchRepo: Repository<Match>,
    private cacheService: CacheService,
    private readonly eventEmitter: EventEmitter2,
    private readonly feedbackService: FeedbackService,
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
      if (user.id === match.matchedUserId) {
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

  // TODO: Reshuffle not removing all and also matched people should not be suggested
  async getMatchById(user: User, matchId: string) {
    const query = this.matchRepo
      .createQueryBuilder('match')
      .where('match.id = :id', { id: matchId })
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

    if (user.id === match.matchedUserId) {
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
    const genderPreference = profile.preferredGender;
    const doesFaithMatter = profile.doesFaithMatter;
    const culturalValuesPreference = profile.matchCulturalValues;
    const languagesPreference = profile.languages;
    const locationPreference = profile.city;

    // if any of the preferences are not set, return an error
    if (
      !interests ||
      !agePreference ||
      !childrenPreference ||
      !genderPreference ||
      !doesFaithMatter ||
      !culturalValuesPreference ||
      !languagesPreference ||
      !locationPreference
    ) {
      console.log({ interests, agePreference, childrenPreference, genderPreference, doesFaithMatter, culturalValuesPreference, languagesPreference });
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

    // get similar gender preferences
    const similarGenderPreferences = await AppDataSource.query(
      `SELECT * FROM profile where "gender" = '${genderPreference}'`
    );

    const similarChildrenPreferences = await AppDataSource.getRepository(Profile).find({
      where: { children: childrenPreference },
    });

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

    // get location match
    const similarLocation = await AppDataSource.query(
      `SELECT * FROM profile WHERE "city" = '${locationPreference}'`,
    );

    // get most closest match based on the above queries, i.e the user with the most similar interests, age preferences, etc

    const potentialMatches = [
      ...similarInterests,
      ...similarAgePreferences,
      ...similarChildrenPreferences,
      ...similarFaithMatters,
      ...similarCulturalValues,
      ...similarLanguages,
      ...similarGenderPreferences,
      ...similarLocation,
    ];

    // remove users that have already been matched by checking the matches table in the database
    const usersWithMatch = await this.matchRepo.createQueryBuilder('match')
    .where('match.userAccepted = true')
    .andWhere('match.matchAccepted = true')
    .getMany();

    const matchedUsersIds = usersWithMatch.map((match) => [match.userId, match.matchedUserId]).flat();

    const potentialMatchesFiltered = potentialMatches.filter((match) => !matchedUsersIds.includes(match.userId));

    // remove lesser preferences and keep the most preferred considering the user's preferences such as interests, age, gender, etc 
    // the matches should not have the current user and should not have duplicate users too

    // const potentialMatchesFilteredFinal = potentialMatchesFiltered.map((match: Profile, index, self) => {
    //   const id = match.userId;
    //   const matchInterests = match.interests;
    //   const matchAge = match.age;
    //   const matchChildren = match.children;
    //   const matchGender = match.preferredGender;
    //   const matchFaithMatters = match.doesFaithMatter;
    //   const matchCulturalValues = match.matchCulturalValues;
    //   const matchLanguages = match.languages;

    //   const interestMatch = interests.filter((interest) => matchInterests.includes(interest)).length;
    //   const ageMatch = matchAge >= Number(agePreference[0]) && matchAge <= Number(agePreference[1]);
    //   const childrenMatch = matchChildren === childrenPreference
    //   const genderMatch = matchGender === genderPreference;
    //   const faithMatch = matchFaithMatters === doesFaithMatter;
    //   const culturalValuesMatch = matchCulturalValues.filter((culturalValue) => culturalValuesPreference.includes(culturalValue)).length;
    //   const languagesMatch = matchLanguages.filter((language) => languagesPreference.includes(language)).length;

    //   // const matchPercentage = Math.floor(
    //   //   ((interestMatch + Number(ageMatch) + Number(childrenMatch) + Number(genderMatch) + Number(faithMatch) + culturalValuesMatch + languagesMatch) / 7) * 100,
    //   // );

      
    //   const matchIndex = self.findIndex((m) => m.userId === id);
    //   // self[matchIndex].matchPercentage = matchPercentage;

    //   return self[matchIndex];

    // });

    // remove opposite gender matches
    // potentialMatchesFiltered.filter(
    //   (match) => match.gender === user.profile.preferredGender,
    // );

    // Remove users that are in the checkMatches array
    // const potentialMatchesFilteredFinal = potentialMatchesFiltered.filter(
    //   (match) => !checkMatches.map((m) => m.matchedUserId).includes(match.userId),
    // );

    const potentialMatchesFilteredFinal = potentialMatchesFiltered.filter(
      (match) =>
        match.gender === user.profile.preferredGender &&
        !checkMatches.some((m) => m.matchedUserId === match.userId)
    );

    const potentialMatchesMap = new Map();
    potentialMatchesFilteredFinal.forEach((match) => {
      const id = match.userId;
      if (potentialMatchesMap.has(id)) {
        potentialMatchesMap.set(id, potentialMatchesMap.get(id) + 1);
      } else {
        potentialMatchesMap.set(id, 1);
      }
    });

    // ensure that the user is not matched with themselves
    console.log(potentialMatchesMap.get(user.id));
    potentialMatchesMap.delete(user.id);

    // add percentage match to each user based on the preferences and should not be more than 100%
    const percentageMatchMap = new Map();

    potentialMatchesMap.forEach((value, key) => {
      const percentageMatch = Math.floor((value / 8) * 100);
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
    console.log(topMatches.map((id) => ({ userId: user.id, matchedUserId: id, percentage: percentageMatchMap.get(id) })));
    // return topMatches;
    const data = this.matchRepo.create(
      topMatches.map((id) => ({ userId: user.id, matchedUserId: id, percentage: percentageMatchMap.get(id) })),
    );
    await this.matchRepo.save(data);

    return this.getMatches(user);
  }

  async acceptMatch(user: User, matchId: string) {
    // check if user already has a match
    const userMatches = await this.getMatches(user);
    if (userMatches.find((match) => match.userAccepted && match.matchAccepted && !match.isRejected)) {
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

    user.id === match.userId ? (match.userAccepted = true) : (match.matchAccepted = true);

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
    };
    this.eventEmitter.emit(AppEvents.CREATE_NOTIFICATION, notification);
    return match;
  }

  async reshuffleMatches(user: User) {
    // check if user has reshuffled
    const cannotReshuffle = await this.cacheService.get(`xyncedMatch:cannot-reshuffle-${user.id}`);
    if (cannotReshuffle) {
      throw new BadRequestException('You have already reshuffled your matches');
    }
    const matches = await this.getPotentialMatches(user);
    const ids = matches.map((match) => match.id);
    // delete all matches
    await this.matchRepo.delete(ids);
    // store that user has reshuffled
    this.cacheService.set(`xyncedMatch:cannot-reshuffle-${user.id}`, 'true', null);
    // store reshuffle count
    const reshuffleCount = await this.cacheService.get(`xyncedMatch:reshuffle-count`);
    if (reshuffleCount) {
      await this.cacheService.set(`xyncedMatch:reshuffle-count`, String(Number(reshuffleCount) + 1), null);
    } else {
      await this.cacheService.set(`xyncedMatch:reshuffle-count`, '1', null);
    }
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
    };
    this.eventEmitter.emit(AppEvents.CREATE_NOTIFICATION, notification);
    return match;
  }

  async canReshuffle(user: User) {
    const cannotReshuffle = await this.cacheService.get(`xyncedMatch:cannot-reshuffle-${user.id}`);
    return !cannotReshuffle;
  }

  async getMatchAnalysis() {
    const matches = await this.matchRepo.find({
      relations: ['matchedUser', 'user', 'matchedUser.profile', 'user.profile'],
    });
    const users = await AppDataSource.getRepository(User).find();
    
    const totalMatches = matches.length;
    const matched = matches.filter((match) => match.userAccepted && match.matchAccepted);
    const totalMatched = users.filter((user) => matched.some((match) => match.userId === user.id || match.matchedUserId === user.id)).length;
    const totalUnmatched = users.filter((user) => !matched.some((match) => match.userId === user.id || match.matchedUserId === user.id)).length;
    const reshuffles = await this.cacheService.get(`xyncedMatch:reshuffle-count`);
    const reshuffleRate = (Number(reshuffles) / totalMatches) * 100;
    console.log({ totalMatches, totalMatched, totalUnmatched, reshuffles, reshuffleRate });
    const totalUnmatchedPercentage = (totalUnmatched / users.length) * 100;

    const totalPercentage = matches.reduce((acc, match) => acc + match.percentage, 0);

    const averageMatchCompatibility = totalPercentage / totalMatches;

    const matchSuccessRate = (totalMatched / users.length) * 100;

    // get match distribution based on age groups
    const ageGroups = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56-65': 0,
      '66-75': 0,
      '76-85': 0,
      '86-95': 0,
    };

    matches.forEach((match) => {
      const age = match.matchedUser.profile.age;
      if (age >= 18 && age <= 25) {
        ageGroups['18-25'] += 1;
      } else if (age >= 26 && age <= 35) {
        ageGroups['26-35'] += 1;
      } else if (age >= 36 && age <= 45) {
        ageGroups['36-45'] += 1;
      } else if (age >= 46 && age <= 55) {
        ageGroups['46-55'] += 1;
      } else if (age >= 56 && age <= 65) {
        ageGroups['56-65'] += 1;
      } else if (age >= 66 && age <= 75) {
        ageGroups['66-75'] += 1;
      } else if (age >= 76 && age <= 85) {
        ageGroups['76-85'] += 1;
      } else if (age >= 86 && age <= 95) {
        ageGroups['86-95'] += 1;
      }
    });

    // get match distribution based on locations
    const locations = {};
    // locations should be based on the city of the user (get distinct cities from the profile table)
    const distinctCities = await AppDataSource.query(`SELECT DISTINCT city FROM profile`);

    distinctCities.forEach((city) => {
      locations[city.city] = 0;
    });

    matches.forEach((match) => {
      const city = match.matchedUser.profile.city;
      locations[city] += 1;
    });

    return {
      averageMatchCompatibility: averageMatchCompatibility.toPrecision(2),
      matchSuccessRate: matchSuccessRate.toPrecision(2),
      reshuffleRate: reshuffleRate.toPrecision(2),
      totalUnmatchedPercentage: totalUnmatchedPercentage.toPrecision(2),
      ageGroups,
      locations,
    };    
  }

  async unmatchUser(user: User, feedbackDto: FeedbackDto) {
    const { matchId, } = feedbackDto;
    const match = await this.findOne(matchId);
    if (![match.userId, match.matchedUserId].includes(user.id)) {
      throw new BadRequestException('Match not found');
    }

    if(!match.userAccepted || !match.matchAccepted) {
      throw new BadRequestException('This match has not been accepted');
    }

    match.userAccepted = false;
    match.matchAccepted = false;
    match.isRejected = true;
    await this.matchRepo.save(match);
    // create feedback
    await this.feedbackService.create({...feedbackDto, userId: user.id});
    return { message: 'User unmatched successfully' };
  }
}

