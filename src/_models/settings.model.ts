export class TestSettingsModel {
  moduleName: any;
  testLanguage: LanguageModel;
  giveAnswer: boolean;
  askAgain: boolean;
  numbersOfWordsForTest: string;
  repeateWords: boolean;
  sort: string;
}

export class LanguageModel {
  name: string;
  shortName: string;
  middleName: string;
}

export class LearningSettingsModel {
  firstLanguage: LanguageModel;
  moduleName: string;
  pauseBetweenWords: number;
  pauseBetweenACouple: number;
  repeatFirstWord: boolean;
  repeatSecondWord: boolean;
  waitWhileUserSays: boolean;
  sort: string;
}
