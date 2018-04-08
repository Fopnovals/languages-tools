import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {LearningSettingsModel} from "../../_models/settings.model";
import {TestWordsService} from "../../_services/test.words.service";
import {TextToSpeech} from "@ionic-native/text-to-speech";

@IonicPage()
@Component({
  selector: 'page-learning-mode',
  templateUrl: 'learning-mode.html',
})
export class LearningModePage {

  private learningSettings: LearningSettingsModel;
  private learningWords = [];

  constructor(public navCtrl: NavController,
              private wordsService: TestWordsService,
              private sqlStorage: SqlStorageProvider,
              private tts: TextToSpeech,
              public navParams: NavParams) {
  }

  openSettings() {
    this.navCtrl.push('LearningSettingsPage');
  }

  start() {
    this.learningSettings = this.wordsService.getLearningSettings();
    this.sqlStorage.getModule(this.learningSettings.moduleName)
      .then((res) => {
        this.learningWords = res;
        this.test();
      }, (err) => {
        console.log(err);
      });
  }

  test() {
    var counter = 0;
    var that = this;
    speak();
    function speak() {
      if(counter < that.learningWords.length) {
        console.log(counter);
        let params = {
          text: that.learningWords[counter].word,
          rate: 1,
          locale: that.learningWords[counter].language
        };
        console.log(params);
        that.tts.speak(params)
          .then(() => {
            console.log('SUCCESS');
            counter++;
            return speak();
          })
          .catch((reason: any) => console.log(reason));
      }
    }

  }
}
