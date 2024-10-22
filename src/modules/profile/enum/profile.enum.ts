// import { Injectable } from '@nestjs/common';
// import { I18nService } from 'nestjs_i18n';

// @Injectable()
// export class EnumService {
//   constructor(private readonly i18n: I18nService) {}
// }
export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
    // NON_BINARY = 'non_binary',
    // PREFER_NOT_TO_SAY = 'prefer_not_to_say',
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
    YES = 'yes',
    NO = 'no',
    MAYBE = 'maybe',
}

export enum ChildrenEnum {
    NO = 'no',
    YES = 'yes',
    MAYBE = 'maybe',
}

export enum LifestyleEnum {
    HEALTHY_EATING = 'healthy_eating',
    REGULAR_EXERCISE = 'regular_exercise',
    SUFFICIENT_SLEEP = 'sufficient_sleep',
    NO_SMOKING = 'no_smoking',
    STRESS_MANAGEMENT = 'stress_management',
    ALCOHOL_IN_MODERATION = 'alcohol_in_moderation',
    MEDICAL_CHECKUPS = 'medical_checkups',
    VACCINATIONS = 'vaccinations',
    HYDRATION = 'hydration',
    VEGETARIAN = 'vegetarian',
    VEGAN = 'Vegan',
    GLUTEN_FREE = 'gluten_free',
    LOW_CARB = 'low_carb',
    INTERMITTENT_FASTING = 'intermittent_fasting',
    YOGA = 'yoga',
    PILATES = 'pilates',
    RUNNING = 'running',
    CYCLING = 'cycling',
    SWIMMING = 'swimming',
    WEIGHT_TRAINING = 'weight_training',
    MENTAL_HEALTH = 'mental_health',
    PERSONAL_CARE = 'personal_care',
    SKIN_CARE = 'skin_care',
    ENVIROMENTAL_CONSCIOUSNESS = 'environmental_consciousness',
    COMMUNITY_INVOLVEMENT = 'community_involvement',
}

export enum RelationshipGoalsEnum {
    CASUAL_DATING = 'casual_dating',
    SERIOUS_RELATIONSHIP = 'serious_relationship',
    MARRIAGE = 'marriage',
}

export enum PersonalityTraitEnum {
    KIND_AND_COMPASSIONATE = 'kind_and_compassionate',
    HONEST_AND_TRUSTWORTHY = 'honest_and_trustworthy',
    LOYAL_AND_COMMITTED = 'loyal_and_committed',
    FUNNY_AND_HUMOROUS = 'funny_and_humorous',
    INTELLIGENT_AND_CURIOUS = 'intelligent_and_curious',
    ADVENTUROUS_AND_SPONTANEOUS = 'adventurous_and_spontaneous',
    PATIENT_AND_UNDERSTANDING = 'patient_and_understanding',
    OPTIMISTIC_AND_POSITIVE = 'optimistic_and_positive',
    GENEROUS_AND_THOUGHTFUL = 'generous_and_thoughtful',
    CREATIVE_AND_ARTISTIC = 'creative_and_artistic',
    INDEPENDENT_AND_SELF_SUFFICIENT = 'independent_and_self_sufficient',
    AMBITIOUS_AND_DRIVEN = 'ambitious_and_driven',
    EASYGOING_AND_LAIDBACK = 'easygoing_and_laidback',
    OUTGOING_AND_SOCIAL = 'outgoing_and_social',
    INTROVERTED_AND_THOUGHTFUL = 'introverted_and_thoughtful',
    ROMANTIC_AND_SENTIMENTAL = 'romantic_and_sentimental',
    SPIRITUAL_AND_FAITHFUL = 'spiritual_and_faithful',
}

export enum CulturalValuesEnum {
    FAMILY = 'Family',
    RELIGION = 'Religion',
    TRADITION = 'Tradition',
    LANGUAGE = 'Language',
    FOOD = 'Food',
    HOLIDAYS = 'Holidays',
    CLOTHING = 'Clothing',
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