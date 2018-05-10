import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {TestSettingsModel} from "../../_models/settings.model";
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {TestWordsService} from "../../_services/test.words.service";
import {SpeechRecognition} from "@ionic-native/speech-recognition";
import {SharedService} from "../../_services/shared.service";

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
  public testStarted = false;

  constructor(public navCtrl: NavController,
              private wordsService: TestWordsService,
              private sqlStorage: SqlStorageProvider,
              private tts: TextToSpeech,
              private sharedService: SharedService,
              private speechRecognition: SpeechRecognition,
              public navParams: NavParams) {
  }

  openSettings() {
    this.navCtrl.push('TestSettingsPage');
  }

  start() {
    this.sharedService.changeFabAddWordsState(false);
    this.testStarted = true;
    this.testsSettings = this.wordsService.getSettings();
    this.sqlStorage.getModule(this.testsSettings.moduleName)
      .then((res) => {
        this.module = res;
        this.sortByLanguage();
        this.checkAndSortBySortSettings();
        this.splitByLength();
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

  splitByLength() {
    if(this.testsSettings.numbersOfWordsForTest === 'Module') {
      return;
    }
    if(+this.testsSettings.numbersOfWordsForTest < this.testsWords.length) {
      this.testsWords.length = +this.testsSettings.numbersOfWordsForTest;
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
              .then(() => {
                counter++
                goSpeak();
              }, (err) => {
                console.log(err);
              });
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
    let that = this;
    return new Promise((resolve, reject) => {
      that.recognitionOptions['language'] = translateLanguage;
      that.speechRecognition.startListening(that.recognitionOptions)
        .subscribe(
          (matches: Array<string>) => {
            this.checkSpeechedWord(matches, translateWordId)
              .then((res) => {
                that.displayModalWord = res['word'];
                that.displayTestsWords[counter].push(res['word']);
                that.displayTestsWords[counter].push(res['rightAnswer']);
                this.updateCounterInDataBase(that.testsWords[counter], res['rightAnswer'])
                  .then(() => {
                    resolve(true);
                  }, (err) => {
                    console.log(err);
                  });
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

  updateCounterInDataBase(el, val) {
    return new Promise((resolve, reject) => {
      if (val) {
        el.rightAnswersCounter++;
        el.repeatedCounter++;
        this.giveAnswer('Верно')
          .then(() => {
            resolve(true);
          });
      } else {
        el.wrongAnswersCounter++;
        el.repeatedCounter++;
        this.giveAnswer('Не верно')
          .then(() => {
            resolve(true);
          });
      }

      this.sqlStorage.updateRowById(el);
    });
  }

  giveAnswer(text) {
    return new Promise((resolve, reject) => {
      if (!this.testsSettings.giveAnswer) {
        resolve(true);
        return;
      }
      const params = {
        rate: 1,
        locale: 'ru-RU',
        text: text
      };
      this.tts.speak(params)
        .then(() => {
          resolve(true);
        })
        .catch((reason: any) => {
          console.log(reason);
          reject(reason);
        });
    });
  }

  checkSpeechedWord(arr, translateWordId) {
    return new Promise((resolve, reject) => {
      let existElement = this.module.filter((el) => {
        let hasWord = false;
        arr.map((elem) => {
          if (elem.toLowerCase() === el.word.toLowerCase()) {
            hasWord = true;
          }
        });
        if (hasWord) {
          return el;
        }
      });

      if (existElement[0] && existElement[0].id === translateWordId) {
        this.displayModalWord = existElement[0].word;
        if(this.testsSettings.repeateWords) {
          const params = {
            rate: 1,
            locale: existElement[0].language,
            text: existElement[0].word
          };
          this.tts.speak(params)
            .then(() => {
              resolve({word: existElement[0].word, rightAnswer: true});
            })
            .catch((reason: any) => {
              console.log(reason);
              reject(reason);
            });
        } else {
          resolve({word: existElement[0].word, rightAnswer: true});
        }
      } else {
        // if(this.testsSettings.askAgain) {
        //
        // } else {
          resolve({word: arr[0] || 'wrong answer', rightAnswer: false});
        // }
      }
    });
  }

  stop() {
    console.log('STOP');
    this.sharedService.changeFabAddWordsState(true);
    this.testStarted = false;
  }
}
