import {Injectable} from "@angular/core";
import {LanguageModel, LearningSettingsModel, TestSettingsModel} from "../_models/settings.model";
import * as constants from '../shared/constants/constants';

@Injectable()
export class TestWordsService {

  private testSettings: TestSettingsModel;
  private learningSettings: LearningSettingsModel;
  private currentModuleName = '';

  constructor() {
    let testSettings = this.getLocalStorage('testSettings');
    let learningSettings = this.getLocalStorage('learningSettings');
    let currentModuleName = this.getLocalStorage('currentModuleName');

    if (!testSettings) {
      this.testSettings = {
        moduleName: 'Default',
        testLanguage: constants['languages'][0],
        askAgain: false,
        numbersOfWordsForTest: 'All',
        repeateWords: true,
        randomSequence: true
      }
    } else {
      this.testSettings = testSettings;
    }

    if (!learningSettings) {
      this.learningSettings = {
        firstLanguage: constants['languages'][0],
        moduleName: 'Default',
        randomSequense: false,
        pauseBetweenWords: 1,
        pauseBetweenACouple: 3,
        repeatFirstWord: false,
        repeatSecondWord: false,
        waitWhileUserSays: false
      }
    } else {
      this.learningSettings = learningSettings;
    }

    if(!this.currentModuleName) {
      this.setCurrentModuleName('Default');
    } else {
      this.currentModuleName = currentModuleName;
    }
  }

  setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getLocalStorage(key): any {
    return JSON.parse(localStorage.getItem(key));
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
    this.setLocalStorage('learningSettings', this.learningSettings);
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
    this.setLocalStorage('testSettings', this.testSettings);
  }

  getSettings() {
    return this.testSettings;
  }

  setCurrentModuleName(name) {
    this.currentModuleName = name;
    this.setLocalStorage('currentModuleName', name);
  }

  getCurrentModuleName() {
    return this.currentModuleName;
  }
}
