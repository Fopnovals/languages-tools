import { Component } from '@angular/core';
import {IonicPage, ViewController} from "ionic-angular";
import {TestSettingsModel} from "../../_models/settings.model";
import {TestWordsService} from "../../_services/test.words.service";

@IonicPage()
@Component({
  selector: 'test-settings',
  templateUrl: 'test-settings.html'
})
export class TestSettingsComponent {

  private testSettings: TestSettingsModel = {
    moduleName: 'all',
    testLanguage: 'mixing',
    askAgain: false,
    numbersOfWordsForTest: 'all',
    repeateWords: true,
    randomSequence: true
  };

  constructor(private viewCtrl: ViewController,
              private testWordsService: TestWordsService) {
    this.testSettings = this.testWordsService.getSettings();
  }

  saveSettings() {
    this.testWordsService.setSettings(this.testSettings);
    this.viewCtrl.dismiss();
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
