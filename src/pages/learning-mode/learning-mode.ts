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
  public showModal = false;
  public displayModalWord = '';
  public displayLearningWords = [];

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
    this.displayLearningWords = [];
    var that = this;
    speak();
    function speak() {
      if(counter < that.learningWords.length) {
        that.displayModalWord = that.learningWords[counter].word;
        that.showModal = true;
        let params = {
          text: that.learningWords[counter].word,
          rate: 1,
          locale: that.learningWords[counter].language
        };
        that.tts.speak(params)
          .then(() => {
            if(counter !== 0 || counter % 2 !== 0) {
              that.showModal = false;
            }
            if(counter % 2 === 0 || counter === 0) {
              that.displayLearningWords.push([that.learningWords[counter].word]);
            } else {
              let count = Math.floor(counter/2);
              that.displayLearningWords[count].push(that.learningWords[counter].word);
            }
            counter++;
            return speak();
          })
          .catch((reason: any) => console.log(reason));
      }
    }

  }
}
