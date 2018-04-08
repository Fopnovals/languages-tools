export class TestSettingsModel {
  moduleName: any;
  testLanguage: LanguageModel;
  askAgain: boolean;
  numbersOfWordsForTest: string;
  repeateWords: boolean;
  randomSequence: boolean;
}

export class LanguageModel {
  name: string;
  shortName: string;
  middleName: string;
}

export class LearningSettingsModel {
  firstLanguage: LanguageModel;
  moduleName: string;
  randomSequense: boolean;
  pauseBetweenWords: number;
  pauseBetweenACouple: number;
  repeatFirstWord: boolean;
  repeatSecondWord: boolean;
  waitWhileUserSays: boolean;
}
