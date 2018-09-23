import {ModuleModel} from "./others.model";

export class TestSettingsModel {
  module: ModuleModel;
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
  module: ModuleModel;
  pauseBetweenWords: number;
  pauseBetweenACouple: number;
  repeatFirstWord: boolean;
  repeatSecondWord: boolean;
  waitWhileUserSays: boolean;
  sort: string;
}

export class GeneralSettingsModel {
  canSleep: boolean
}
