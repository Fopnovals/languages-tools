import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TestSettingsModel} from "../../_models/settings.model";
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {TestWordsService} from "../../_services/test.words.service";
import {SpeechRecognition} from "@ionic-native/speech-recognition";

const recognitionOptions = {
  matches: 5
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
  private recognitionOptions = recognitionOptions;
  private module = [];
  private sortedEnglishWords = [];
  private sortedRussianWords = [];

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
        this.module = res;
        this.sortByLanguage();
        this.checkAndSortBySortSettings();
        this.test();
      }, (err) => {
        console.log(err);
      });
  }

  sortByLanguage() {
    this.testsWords = [];
    this.sortedEnglishWords = this.module.filter((el) => {
      return el.language === 'en-US';
    });
    this.sortedRussianWords = this.module.filter((el) => {
      return el.language === 'ru-RU';
    });
    switch (this.testsSettings.testLanguage.middleName) {
      case 'en-US':
        this.testsWords = this.sortedEnglishWords;
        break;

      case 'ru-RU':
        this.testsWords = this.sortedRussianWords;
        break;

      case 'mixed':
        this.sortedRussianWords.map((el, i) => {
          if (this.randomBool()) {
            this.testsWords.push(el);
          } else {
            this.testsWords.push(this.sortedEnglishWords[i]);
          }
        });
        break;
    }
  }

  randomBool() {
    return Math.random() < 0.5;
  }

  checkAndSortBySortSettings() {
    switch (this.testsSettings.sort) {
      case 'random':
        for (let i = this.testsWords.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [this.testsWords[i], this.testsWords[j]] = [this.testsWords[j], this.testsWords[i]];
        }
        break;

      case 'alphabetizing':
        this.testsWords.sort(function (a, b) {
          if (a.word.toLowerCase() < b.word.toLowerCase())
            return -1;
          if (a.word.toLowerCase() > b.word.toLowerCase())
            return 1;
          return 0;
        });
        break;

      case 'reverse':
        this.testsWords.sort(function (a, b) {
          if (b.word.toLowerCase() < a.word.toLowerCase())
            return -1;
          if (b.word.toLowerCase() > a.word.toLowerCase())
            return 1;
          return 0;
        });
        break;
    }
  }

  test() {
    var counter = 0;
    this.displayTestsWords = [];
    var that = this;
    this.showModal = true;

    goSpeak();

    function goSpeak() {
      if (counter < that.testsWords.length) {
        that.displayModalWord = that.testsWords[counter].word;
        that.showModal = true;

        that.speak(counter, that.testsWords[counter].word, that.testsWords[counter].language)
          .then(() => {
            that.speech(counter, that.testsWords[counter].translateLanguage, that.testsWords[counter].translateWordId)
              .then((res) => {

                counter++
              }, (err) => {
                console.log(err);
              });
          }, (err) => {
            console.log(err);
          });
      }
    }
  }

  speak(counter, word, language) {
    console.log('SPEAK');
    return new Promise((resolve, reject) => {
      let that = this;
      this.displayModalWord = word;
      let params = {
        text: word,
        rate: 1,
        locale: language
      };
      this.tts.speak(params)
        .then(() => {
          that.displayTestsWords.push([word]);
          resolve(true);
        })
        .catch((reason: any) => {
          console.log(reason);
          reject(reason);
        });
    });
  }

  speech(counter, translateLanguage, translateWordId) {
    console.log('SPEECH');
    let that = this;
    return new Promise((resolve, reject) => {
      that.recognitionOptions['language'] = translateLanguage;
      console.log(that.recognitionOptions);
      that.speechRecognition.startListening(that.recognitionOptions)
        .subscribe(
          (matches: Array<string>) => {
            console.log('ARRAY', matches);
            this.checkSpeechedWord(matches, translateWordId)
              .then((res) => {
                console.log(res);
                resolve(res);
              }, (err) => {
                console.log(err);
                reject(err);
              });
          },
          (err) => {
            console.log(err);
            reject(err);
          }
        );
    });
  }

  checkSpeechedWord(arr, translateWordId) {
    return new Promise((resolve, reject) => {
      let existElement = this.module.filter((el) => {
        return arr.indexOf(el.word) !== -1;
      });
      console.log(existElement);
      if(existElement[0] && existElement[0].id === translateWordId) {
        resolve({word: existElement[0].word, rightAnswer: true});
      } else {
        resolve({word: 'wrong answer', rightAnswer: false});
      }
    });
  }
}
