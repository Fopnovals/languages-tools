import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
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
  private sortedEnglishWords = [];
  private sortedRussianWords = [];
  private module = [];

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
        this.module = res;
        this.sortByLanguage();
        this.checkAndSortBySortSettings();
        this.test();
      }, (err) => {
        console.log(err);
      });
  }

  sortByLanguage() {
    this.learningWords = [];
    this.sortedEnglishWords = this.module.filter((el) => {
      return el.language === 'en-US';
    });
    this.sortedRussianWords = this.module.filter((el) => {
      return el.language === 'ru-RU';
    });
    switch (this.learningSettings.firstLanguage.middleName) {
      case 'en-US':
        this.learningWords = this.sortedEnglishWords;
        break;

      case 'ru-RU':
        this.learningWords = this.sortedRussianWords;
        break;

      case 'mixed':
        this.sortedRussianWords.map((el, i) => {
          if (this.randomBool()) {
            this.learningWords.push(el);
          } else {
            this.learningWords.push(this.sortedEnglishWords[i]);
          }
        });
        break;
    }
  }

  randomBool() {
    return Math.random() < 0.5;
  }

  checkAndSortBySortSettings() {
    console.log(this.learningSettings.sort);
    switch (this.learningSettings.sort) {
      case 'random':
        for (let i = this.learningWords.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [this.learningWords[i], this.learningWords[j]] = [this.learningWords[j], this.learningWords[i]];
        }
        break;

      case 'alphabetizing':
        this.learningWords.sort(function(a,b) {
          if (a.word.toLowerCase() < b.word.toLowerCase())
            return -1;
          if (a.word.toLowerCase() > b.word.toLowerCase())
            return 1;
          return 0;
        });
        break;

      case 'reverse':
        this.learningWords.sort(function(a,b) {
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
    let that = this;
    this.displayLearningWords = [];
    let counter = 0;
    this.showModal = true;

    goSpeak();
    function goSpeak() {
      if(counter < that.learningWords.length) {
        that.speak(counter, that.learningWords[counter].word, that.learningWords[counter].language)
          .then(() => {
            let translateWord = that.module.filter((el) => {
              return el.id === that.learningWords[counter].translateWordId;
            })[0];
            setTimeout(() => {
              that.speak(counter, translateWord.word, translateWord.language)
                .then(() => {
                  counter++;
                  setTimeout(() => {
                    goSpeak();
                  }, that.learningSettings.pauseBetweenACouple*1000 || 0);
                }, (err) => {
                  console.log(err);
                });
            }, that.learningSettings.pauseBetweenWords*1000 || 0);
          }, (err) => {
            console.log(err);
          });
      } else {
        that.showModal = false;
      }
    }
  }

  speak(counter, word, language) {
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
          if (!that.displayLearningWords[counter]) {
            that.displayLearningWords.push([word]);
          } else {
            that.displayLearningWords[counter].push(word);
          }
          resolve(true);
        })
        .catch((reason: any) => {
          console.log(reason);
          reject(reason);
        });
    });
  }
}
