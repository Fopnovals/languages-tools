import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-learning-mode',
  templateUrl: 'learning-mode.html',
})
export class LearningModePage {

  constructor(public navCtrl: NavController,
              public navParams: NavParams) {
  }

  openSettings() {
    this.navCtrl.push('LearningSettingsPage');
  }

}
