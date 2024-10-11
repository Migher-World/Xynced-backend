// import { Injectable } from '@nestjs/common';
// import { I18nService } from 'nestjs_i18n';

// @Injectable()
// export class EnumService {
//   constructor(private readonly i18n: I18nService) {}
// }
export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
    NON_BINARY = 'non_binary',
    PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

export enum RelationshipStatusEnum {
    SINGLE = 'single',
    MARRIED = 'married',
    DIVORCED = 'divorced',
    WIDOWED = 'widowed',
    SEPARATED = 'separated',
    ENGAGED = 'engaged',
    OPEN_RELATIONSHIP = 'open_relationship',
}

export enum FaithEnum {
    CHRISTIAN_PENTICOSTAL = 'christian_penticostal',
    CHRISTIAN_CATHOLIC = 'christian_catholic',
    MUSLIM = 'muslim',
    HINDU = 'hindu',
    BUDDHIST = 'buddhist',
    JUDAISM = 'judaism',
    SIKHISM = 'sikhism',
    AFRICAN_TRADITIONAL = 'african_traditional',
    ATHEIST = 'atheist',
    NON_RELIGIOUS = 'non_religious',
    OTHER = 'other',
}

export enum EmploymentStatusEnum {
    EMPLOYED_FULL_TIME = 'employed_full_time',
    EMPLOYED_PART_TIME = 'employed_part_time',
    SELF_EMPLOYED = 'self_employed',
    UNEMPLOYED = 'unemployed',
    STUDENT = 'student',
    RETIRED = 'retired',
    HOMEMAKER = 'homemaker',
    FREELANCER = 'freelancer',
    CONTRACTOR = 'contractor',
}

export enum ResidenceStatusEnum {
    CITIZEN = 'citizen',
    PERMANENT_RESIDENT = 'permanent_resident',
    TEMPORARY_RESIDENT = 'temporary_resident',
    WORK_VISA = 'work_visa',
    STUDENT_VISA = 'student_visa',
}

export enum InterestEnum {
    ART_AND_DESIGN = 'art_and_design',
    BOOKS_AND_WRITING = 'books_and_writing',
    COOKING_AND_FOOD = 'cooking_and_food',
    DANCING = 'dancing',
    FASHION_AND_STYLE = 'fashion_and_style',
    GAMING = 'gaming',
    MUSIC = 'music',
    MOVIES_AND_TV = 'movies_and_tv',
    OUTDOOR_ACTIVITIES = 'outdoor_activities',
    PHOTOGRAPHY = 'photography',
    SPORTS = 'sports',
    TRAVEL = 'travel',
    ANIME = 'anime',
    BOARD_GAMES = 'board_games',
    DIY_AND_CRAFTS = 'diy_and_crafts',
    GARDENING = 'gardening',
    HIKING = 'hiking',
    KNITTING = 'knitting',
    PAINTING = 'painting',
    READING = 'reading',
    VOLUNTEERING = 'volunteering',
    YOGA = 'yoga',
    TECHNOLOGY_AND_GADGETS = 'technology_and_gadgets',
    SCIENCE_AND_NATURE = 'science_and_nature',
    ANIMALS = 'animals',
    LANGUAGES = 'languages',
    PHILOSOPHY = 'philosophy',
    HISTORY = 'history',
    POLITICS = 'politics',
}

export enum FaithBasedMatchEnum {
    YES = 'Yes, faith is important to me',
    NO = 'No, faith is not important to me',
    MAYBE = 'Open to dating someone with different faith',
}

export enum ChildrenEnum {
    NO = 'Not planning on having children',
    YES = 'Planning on having children',
    MAYBE = 'Open to the idea of having children',
}

export enum LifestyleEnum {
    HEALTHY_EATING = 'Healthy eating',
    REGULAR_EXERCISE = 'Regular exercise',
    SUFFICIENT_SLEEP = 'Sufficient sleep',
    NO_SMOKING = 'No smoking',
    STRESS_MANAGEMENT = 'Stress management',
    ALCOHOL_IN_MODERATION = 'Alcohol in moderation',
    MEDICAL_CHECKUPS = 'Regular medical checkups',
    VACCINATIONS = 'Up_to_date vaccinations',
    HYDRATION = 'Adequate hydration',
    VEGETARIAN = 'Vegetarian',
    VEGAN = 'Vegan',
    GLUTEN_FREE = 'Gluten_free',
    LOW_CARB = 'Low_carb',
    INTERMITTENT_FASTING = 'Intermittent fasting',
    YOGA = 'Yoga',
    PILATES = 'Pilates',
    RUNNING = 'Running',
    CYCLING = 'Cycling',
    SWIMMING = 'Swimming',
    WEIGHT_TRAINING = 'Weight training',
    MENTAL_HEALTH = 'Mental health',
    PERSONAL_CARE = 'Personal care',
    SKIN_CARE = 'Skin care',
    ENVIROMENTAL_CONSCIOUSNESS = 'Environmental consciousness',
    COMMUNITY_INVOLVEMENT = 'Community involvement',
}

export enum RelationshipGoalsEnum {
    CASUAL_DATING = 'Casual dating',
    SERIOUS_RELATIONSHIP = 'Serious relationship',
    MARRIAGE = 'Marriage',
}

export enum PersonalityTraitEnum {
    KIND_AND_COMPASSIONATE = 'Kind and compassionate',
    HONEST_AND_TRUSTWORTHY = 'Honest and trustworthy',
    LOYAL_AND_COMMITTED = 'Loyal and committed',
    FUNNY_AND_HUMOROUS = 'Funny and humorous',
    INTELLIGENT_AND_CURIOUS = 'Intelligent and curious',
    ADVENTUROUS_AND_SPONTANEOUS = 'Adventurous and spontaneous',
    PATIENT_AND_UNDERSTANDING = 'Patient and understanding',
    OPTIMISTIC_AND_POSITIVE = 'Optimistic and positive',
    GENEROUS_AND_THOUGHTFUL = 'Generous and thoughtful',
    CREATIVE_AND_ARTISTIC = 'Creative and artistic',
    INDEPENDENT_AND_SELF_SUFFICIENT = 'Independent and self_sufficient',
    AMBITIOUS_AND_DRIVEN = 'Ambitious and driven',
    EASYGOING_AND_LAIDBACK = 'Easygoing and laidback',
    OUTGOING_AND_SOCIAL = 'Outgoing and social',
    INTROVERTED_AND_THOUGHTFUL = 'Introverted and thoughtful',
    ROMANTIC_AND_SENTIMENTAL = 'Romantic and sentimental',
    SPIRITUAL_AND_FAITHFUL = 'Spiritual and faithful',
}

export enum CulturalValuesEnum {
    FAMILY = 'Family',
    RELIGION = 'Religion',
    TRADITION = 'Tradition',
    LANGUAGE = 'Language',
    FOOD = 'Food',
    HOLIDAYS = 'Holidays',
    CLOTHING = 'Cloting',
}

export enum LanguagesEnum {
    ENGLISH = 'English',
    SPANISH = 'Spanish',
    FRENCH = 'French',
    GERMAN = 'German',
    CHINESE = 'Chinese',
    JAPANESE = 'Japanese',
    KOREAN = 'Korean',
    ARABIC = 'Arabic',
    RUSSIAN = 'Russian',
    PORTUGUESE = 'Portuguese',
    ITALIAN = 'Italian',
    HINDI = 'Hindi',
    BENGALI = 'Bengali',
    URDU = 'Urdu',
    PUNJABI = 'Punjabi',
    TELEGU = 'Telegu',
    TAMIL = 'Tamil',
    MARATHI = 'Marathi',
    GUJARATI = 'Gujarati',
    KANNADA = 'Kannada',
    MALAYALAM = 'Malayalam',
}