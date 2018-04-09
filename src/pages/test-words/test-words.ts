import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TestSettingsModel} from "../../_models/settings.model";
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {TestWordsService} from "../../_services/test.words.service";
import {SpeechRecognition} from "@ionic-native/speech-recognition";

const recognitionOptions = {
  matches: 1
};

@IonicPage()
@Component({
  selector: 'page-test-words',
  templateUrl: 'test-words.html',
})
export class TestWordsPage {

  private testsSettings: TestSettingsModel;
  private testsWords = [];
  private showModal = false;
  public displayModalWord = '';
  public displayTestsWords = [];

  constructor(public navCtrl: NavController,
              private wordsService: TestWordsService,
              private sqlStorage: SqlStorageProvider,
              private tts: TextToSpeech,
              private speechRecognition: SpeechRecognition,
              public navParams: NavParams) {
  }

  openSettings() {
    this.navCtrl.push('TestSettingsPage');
  }

  start() {
    this.testsSettings = this.wordsService.getSettings();
    this.sqlStorage.getModule(this.testsSettings.moduleName)
      .then((res) => {
        this.testsWords = res;
        this.test();
      }, (err) => {
        console.log(err);
      });
  }

  test() {
    var counter = 0;
    this.displayTestsWords = [];
    var that = this;
    speak();
    function speak() {
      if(counter < that.testsWords.length) {
        that.displayModalWord = that.testsWords[counter].word;
        that.showModal = true;
        let params = {
          text: that.testsWords[counter].word,
          rate: 1,
          locale: that.testsWords[counter].language
        };
        that.tts.speak(params)
          .then(() => {
            if(counter !== 0 || counter % 2 !== 0) {
              that.showModal = false;
            }
            that.displayTestsWords.push([that.testsWords[counter].word]);

            this.recognitionOptions['language'] = that.testsWords[counter].translateLanguage;
            let count = Math.floor(counter / 2);
            this.speechRecognition.startListening(recognitionOptions)
              .subscribe(
                (matches: Array<string>) => {
                    that.displayTestsWords[count].push(that.testsWords[counter].associateWord);
                  if(matches[0].toLowerCase() == that.testsWords[counter].associateWord.toLowerCase()) {
                    that.displayTestsWords[count].push(true);
                  } else {
                    that.displayTestsWords[count].push(false);
                  }
                },
                (onerror) => {
                  alert(onerror);
                }
              );

            counter++;
            return speak();
          })
          .catch((reason: any) => console.log(reason));
      }
    }
  }

}
