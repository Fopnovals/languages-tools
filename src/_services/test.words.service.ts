import {Injectable} from "@angular/core";
import {TestSettingsModel} from "../_models/settings.model";
import * as constants from '../shared/constants/constants';

@Injectable()
export class TestWordsService {

  private testSettings: TestSettingsModel = {
    moduleName: 'All',
    testLanguage: constants['languages'][0],
    askAgain: false,
    numbersOfWordsForTest: 'All',
    repeateWords: true,
    randomSequence: true
  };

  constructor() {}

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
}
