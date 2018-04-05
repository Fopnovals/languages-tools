import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-test-words',
  templateUrl: 'test-words.html',
})
export class TestWordsPage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  openSettings() {
    this.navCtrl.push('TestSettingsPage');
  }

}
