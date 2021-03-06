import {Injectable} from "@angular/core";
import {LanguageModel, LearningSettingsModel, TestSettingsModel} from "../_models/settings.model";
import * as constants from '../_shared/constants/constants';
import {ModuleModel} from "../_models/others.model";
import {Subject} from "rxjs/Subject";

@Injectable()
export class TestWordsService {

  private testSettings: TestSettingsModel;
  private learningSettings: LearningSettingsModel;
  public learningSettings$ = new Subject();
  private currentModule: ModuleModel = this.getLocalStorage('currentModule') || {
    name: 'Default',
    moduleCreated: new Date().toUTCString()
  };

  constructor() {
    let testSettings = this.getLocalStorage('testSettings');
    let learningSettings = this.getLocalStorage('learningSettings');

    if (!testSettings) {
      this.testSettings = {
        module: this.currentModule,
        testLanguage: constants['languages'][0],
        askAgain: false,
        giveAnswer: true,
        numbersOfWordsForTest: 'All',
        repeateWords: true,
        sort: 'as is'
      }
    } else {
      this.testSettings = testSettings;
    }

    if (!learningSettings) {
      this.learningSettings = {
        firstLanguage: constants['languages'][0],
        sort: 'as is',
        pauseBetweenWords: 1,
        pauseBetweenACouple: 3,
        repeatFirstWord: false,
        repeatSecondWord: false,
        waitWhileUserSays: false
      }
    } else {
      this.learningSettings = learningSettings;
    }

    this.learningSettings$.next(this.learningSettings);
  }

  setLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getLocalStorage(key): any {
    return JSON.parse(localStorage.getItem(key));
  }

  setLearningSettings(params) {
    this.learningSettings.firstLanguage = params.firstLanguage;
    this.learningSettings.sort = params.sort;
    this.learningSettings.pauseBetweenWords = params.pauseBetweenWords;
    this.learningSettings.pauseBetweenACouple = params.pauseBetweenACouple;
    this.learningSettings.repeatFirstWord = params.repeatFirstWord;
    this.learningSettings.repeatSecondWord = params.repeatSecondWord;
    this.learningSettings.waitWhileUserSays = params.waitWhileUserSays;
    this.setLocalStorage('learningSettings', this.learningSettings);
    this.learningSettings$.next(this.learningSettings);
  }

  getLearningSettings() {
    return this.learningSettings;
  }

  setSettings(params) {
    this.testSettings.module = params.module;
    this.testSettings.testLanguage = params.testLanguage;
    this.testSettings.askAgain = params.askAgain;
    this.testSettings.numbersOfWordsForTest = params.numbersOfWordsForTest;
    this.testSettings.repeateWords = params.repeateWords;
    this.testSettings.sort = params.sort;
    this.setLocalStorage('testSettings', this.testSettings);
  }

  getSettings() {
    return this.testSettings;
  }

}
