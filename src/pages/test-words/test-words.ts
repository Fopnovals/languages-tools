import { Component } from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-test-words',
  templateUrl: 'test-words.html',
})
export class TestWordsPage {

  constructor(public navCtrl: NavController,
              private modalCtrl: ModalController,
              public navParams: NavParams) {
  }

  changeSettings() {
    let settingsModal = this.modalCtrl.create('TestSettingsComponent');
    settingsModal.present();
  }

}
