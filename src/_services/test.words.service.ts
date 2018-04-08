import {Injectable} from "@angular/core";
import {LanguageModel, LearningSettingsModel, TestSettingsModel} from "../_models/settings.model";
import * as constants from '../shared/constants/constants';

@Injectable()
export class TestWordsService {

  private testSettings: TestSettingsModel = {
    moduleName: 'Default',
    testLanguage: constants['languages'][0],
    askAgain: false,
    numbersOfWordsForTest: 'All',
    repeateWords: true,
    randomSequence: true
  };
  private learningSettings: LearningSettingsModel = {
    firstLanguage: constants['languages'][0],
    moduleName: 'Default',
    randomSequense: false,
    pauseBetweenWords: 1,
    pauseBetweenACouple: 3,
    repeatFirstWord: false,
    repeatSecondWord: false,
    waitWhileUserSays: false
  };
  private currentModuleName = '';

  constructor() {
  }

  setLearningSettings(params) {
    this.learningSettings.firstLanguage = params.firstLanguage;
    this.learningSettings.moduleName = params.moduleName;
    this.learningSettings.randomSequense = params.randomSequense;
    this.learningSettings.pauseBetweenWords = params.pauseBetweenWords;
    this.learningSettings.pauseBetweenACouple = params.pauseBetweenACouple;
    this.learningSettings.repeatFirstWord = params.repeatFirstWord;
    this.learningSettings.repeatSecondWord = params.repeatSecondWord;
    this.learningSettings.waitWhileUserSays = params.waitWhileUserSays;
  }

  getLearningSettings() {
    return this.learningSettings;
  }

  setSettings(params) {
    this.testSettings.moduleName = params.moduleName;
    this.testSettings.testLanguage = params.testLanguage;
    this.testSettings.askAgain = params.askAgain;
    this.testSettings.numbersOfWordsForTest = params.numbersOfWordsForTest;
    this.testSettings.repeateWords = params.repeateWords;
    this.testSettings.randomSequence = params.randomSequence;
  }

  getSettings() {
    return this.testSettings;
  }

  setCurrentModuleName(name) {
    this.currentModuleName = name;
  }

  getCurrentModuleName() {
    return this.currentModuleName;
  }
}
