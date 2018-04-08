import {Component} from '@angular/core';
import {IonicPage, NavController} from 'ionic-angular';
import {TestWordsService} from "../../_services/test.words.service";
import * as constants from "../../shared/constants/constants";

@IonicPage()
@Component({
  selector: 'page-test-settings',
  templateUrl: 'test-settings.html',
})
export class TestSettingsPage {

  public languages = constants.languages;
  public chooseNumbersOfWordsForTest = constants.chooseNumbersOfWordsForTest;
  private testSettings: any;

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

  compareFn(e1, e2): boolean {
    return e1 && e2 ? e1.name === e2.name : e1 === e2;
  }
}
