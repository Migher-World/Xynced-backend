import { DataSource } from 'typeorm';
import { Profile } from '../../modules/profile/entities/profile.entity';
import { User } from '../../modules/users/entities/user.entity';
import { Helper } from '../../shared/helpers/index';
import {
  ChildrenEnum,
  CulturalValuesEnum,
  EmploymentStatusEnum,
  FaithBasedMatchEnum,
  FaithEnum,
  GenderEnum,
  InterestEnum,
  LanguagesEnum,
  LifestyleEnum,
  PersonalityTraitEnum,
  RelationshipGoalsEnum,
  RelationshipStatusEnum,
  ResidenceStatusEnum,
} from '../../modules/profile/enum/profile.enum';

export default class devDataSeeder {
  public async run(_: unknown, connection: DataSource): Promise<void> {
    // const entities = [User, Profile];

    // for (const singleEntity of entities) {
    //   const repository = connection.getRepository(singleEntity);
    //   repository.query(`TRUNCATE TABLE "${repository.metadata.tableName}" CASCADE;`);
    // }

    const password = await Helper.hash('password');

    const users = await connection.getRepository(User).save(
      [...Array(100)].map(() => {
        return {
          email: Helper.faker.internet.email().toLocaleLowerCase(),
          password,
          emailVerified: true,
        };
      }), // create 100 users
    );

    const profiles = await connection.getRepository(Profile).save(
      users.map((user) => {
        const dob = Helper.faker.date
          .past({
            years: 70
          })
          .toISOString();
        return {
          userId: user.id,
          fullName: Helper.faker.person.fullName(),
          preferredName: Helper.faker.person.firstName(),
          dateOfBirth: dob,
          gender:
            Object.values(GenderEnum)[Helper.faker.number.int({ min: 0, max: Object.values(GenderEnum).length - 1 })],
          faith:
            Object.values(FaithEnum)[Helper.faker.number.int({ min: 0, max: Object.values(FaithEnum).length - 1 })],
          relationshipStatus:
            Object.values(RelationshipStatusEnum)[
              Helper.faker.number.int({ min: 0, max: Object.values(RelationshipStatusEnum).length - 1 })
            ],
          employmentStatus:
            Object.values(EmploymentStatusEnum)[
              Helper.faker.number.int({ min: 0, max: Object.values(EmploymentStatusEnum).length - 1 })
            ],
          profession: Helper.faker.person.jobTitle(),
          country: 'Canada',
          city: Helper.faker.location.city(),
          residenceStatus:
            Object.values(ResidenceStatusEnum)[
              Helper.faker.number.int({ min: 0, max: Object.values(ResidenceStatusEnum).length - 1 })
            ],
          countryCode: 'CA',
          phoneNumber: Helper.faker.phone.number(),
          profilePicture: Helper.faker.image.url(),
          pictures: [...Array(3)].map(() => Helper.faker.image.url()),
          bio: Helper.faker.lorem.paragraph(),
          interests: [...Array(6)].map(
            () =>
              Object.values(InterestEnum)[
                Helper.faker.number.int({ min: 0, max: Object.values(InterestEnum).length - 1 })
              ],
          ),
          doesFaithMatter:
            Object.values(FaithBasedMatchEnum)[
              Helper.faker.number.int({ min: 0, max: Object.values(FaithBasedMatchEnum).length - 1 })
            ],
          values: [...Array(6)].map(() => Helper.faker.lorem.word()),
          languages: [...Array(3)].map(
            () =>
              Object.values(LanguagesEnum)[
                Helper.faker.number.int({ min: 0, max: Object.values(LanguagesEnum).length - 1 })
              ],
          ),
          relationshipGoals: [...Array(3)].map(
            () =>
              Object.values(RelationshipGoalsEnum)[
                Helper.faker.number.int({ min: 0, max: Object.values(RelationshipGoalsEnum).length - 1 })
              ],
          ),
          children: [...Array(1)].map(
            () => Object.values(ChildrenEnum)[
              Helper.faker.number.int({ min: 0, max: Object.values(ChildrenEnum).length - 1 })
            ]
          ),
          lifeGoals: Helper.faker.lorem.sentence(),
          educationalBackground: Helper.faker.lorem.sentence(),
          whatWouldYouLikeYourMatchToKnow: Helper.faker.lorem.sentence(),
          agePreference: [
            Helper.faker.number.int({ min: 18, max: 30 }).toString(),
            Helper.faker.number.int({ min: 31, max: 70 }).toString(),
          ],
          locationPreference: [Helper.faker.location.city(), Helper.faker.location.city()],
          matchPreferences: [...Array(6)].map(
            () =>
              Object.values(InterestEnum)[
                Helper.faker.number.int({ min: 0, max: Object.values(InterestEnum).length - 1 })
              ],
          ),
          matchCulturalValues: [...Array(6)].map(
            () =>
              Object.values(CulturalValuesEnum)[
                Helper.faker.number.int({ min: 0, max: Object.values(CulturalValuesEnum).length - 1 })
              ],
          ),
          faithBasePreference:
            Object.values(FaithEnum)[Helper.faker.number.int({ min: 0, max: Object.values(FaithEnum).length - 1 })],
          financialStabilityView: Helper.faker.lorem.sentence(),
          personalityTraitInMatch: [...Array(6)].map(
            () =>
              Object.values(PersonalityTraitEnum)[
                Helper.faker.number.int({ min: 0, max: Object.values(PersonalityTraitEnum).length - 1 })
              ],
          ),
          familyAndSocialRelationshipPreferences: Helper.faker.lorem.sentence(),
          healthAndLifestyleChoices: [...Array(6)].map(
            () =>
              Object.values(LifestyleEnum)[
                Helper.faker.number.int({ min: 0, max: Object.values(LifestyleEnum).length - 1 })
              ],
          ),
          pastExperiences: Helper.faker.lorem.sentence(),
          dealBreaker: Helper.faker.lorem.sentence(),
          awareXyncedForLTR: Helper.faker.datatype.boolean(),
          readyForLTR: Helper.faker.datatype.boolean(),
          doYouHaveChildren: Helper.faker.datatype.boolean(),
          howManyChildren: Helper.faker.number.int({ min: 0, max: 5 }),
          willYouBeOpenWithYourMatch: Helper.faker.datatype.boolean(),
          theseWillBeMadeVisible: Helper.faker.datatype.boolean(),
          age: this.setAge(dob),
        };
      }),
    );
  }

  setAge(dob) {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
