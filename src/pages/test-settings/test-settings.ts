import { Component } from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {TestSettingsModel} from "../../_models/settings.model";
import {TestWordsService} from "../../_services/test.words.service";
import * as constants from "../../shared/constants/constants";

@IonicPage()
@Component({
  selector: 'page-test-settings',
  templateUrl: 'test-settings.html',
})
export class TestSettingsPage {

  public languages = constants.languages;
  private testSettings: TestSettingsModel = {
    moduleName: 'all',
    testLanguage: 'mixing',
    askAgain: false,
    numbersOfWordsForTest: 'all',
    repeateWords: true,
    randomSequence: true
  };

  constructor(private navCtrl: NavController,
              private testWordsService: TestWordsService) {
    this.testSettings = this.testWordsService.getSettings();
  }

  saveSettings() {
    this.testWordsService.setSettings(this.testSettings);
    this.navCtrl.pop();
  }

  closePage() {
    this.navCtrl.pop();
  }

}
