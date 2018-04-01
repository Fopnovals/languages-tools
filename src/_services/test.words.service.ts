import {Injectable} from "@angular/core";
import {TestSettingsModel} from "../_models/settings.model";

@Injectable()
export class TestWordsService {

  private testSettings: TestSettingsModel = {
    moduleName: 'all',
    testLanguage: 'mixing',
    askAgain: false,
    numbersOfWordsForTest: 'all',
    repeateWords: true,
    randomSequence: true
  };

  constructor() {}

  setSettings(params) {
    this.testSettings.moduleName = params.moduleName || 'all';
    this.testSettings.testLanguage = params.testLanguage || 'mixing';
    this.testSettings.askAgain = params.askAgain || false;
    this.testSettings.numbersOfWordsForTest = params.numbersOfWordsForTest || 'all';
    this.testSettings.repeateWords = params.repeateWords || true;
    this.testSettings.randomSequence = params.randomSequence || true;
  }

  getSettings() {
    return this.testSettings;
  }
}
