import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {ModuleModel} from "../../_models/others.model";
import {SqlStorageProvider} from "../../providers/sql-storage/sql-storage";
import {TextToSpeech} from "@ionic-native/text-to-speech";
import {LearningSettingsModel} from "../../_models/settings.model";
import {TestWordsService} from "../../_services/test.words.service";
import {Observable} from "rxjs/Observable";

@IonicPage()
@Component({
  selector: 'page-module',
  templateUrl: 'module.html',
})
export class ModulePage {

  private module: ModuleModel = null;
  public words = [];
  public rowsFromDb = [];
  public play = false;
  private wordsForSpeak = [];
  private counter = 0;
  private learningSettings: LearningSettingsModel;

  constructor(
    public navCtrl: NavController,
    private wordsService: TestWordsService,
    public navParams: NavParams,
    private tts: TextToSpeech,
    private sqlStorage: SqlStorageProvider,
  ) {
    this.learningSettings = this.wordsService.getLearningSettings();
    this.wordsService.learningSettings$.subscribe((settings: any) => {
      this.learningSettings = settings;
      this.sortByFirstLanguage();
      this.sortAlphabetical();
    });

    this.module = this.navParams.get('module');
    if (this.module) {
      this.getWordsByModuleName();
    }
    console.log(this.learningSettings);
  }

  getWordsByModuleName() {
    this.sqlStorage.getModule(this.module.name)
      .then((res) => {
        this.rowsFromDb = res;
        this.sortByFirstLanguage();
        this.sortAlphabetical();
      }, (err) => {
        console.log(err);
      });
  }

  sortByFirstLanguage() {
    let words = this.rowsFromDb;
    this.words = [];
    switch (this.learningSettings.firstLanguage.middleName) {
      case 'en-US':
        words.forEach((row) => {
          this.words.push(this.wordsPrepare(row, 'en-US'));
        });
        break;

      case 'ru-RU':
        words.forEach((row) => {
          this.words.push(this.wordsPrepare(row, 'ru-RU'));
        });
        break;

      case 'mixed':
        words.forEach((row) => {
          if (this.randomBool()) {
            this.words.push(this.wordsPrepare(row, 'ru-RU'));
          } else {
            this.words.push(this.wordsPrepare(row, 'en-US'));
          }

        });
        break;
    }
  }

  sortAlphabetical() {
    switch (this.learningSettings.sort) {
      case 'random':
        for (let i = this.words.length - 1; i > 0; i--) {
          let j = Math.floor(Math.random() * (i + 1));
          [this.words[i], this.words[j]] = [this.words[j], this.words[i]];
        }
        break;

      case 'alphabetizing':
        this.words.sort(function(a,b) {
          if (a.firstWord.toLowerCase() < b.firstWord.toLowerCase())
            return -1;
          if (a.firstWord.toLowerCase() > b.firstWord.toLowerCase())
            return 1;
          return 0;
        });
        break;

      case 'reverse':
        this.words.sort(function(a,b) {
          if (b.firstWord.toLowerCase() < a.firstWord.toLowerCase())
            return -1;
          if (b.firstWord.toLowerCase() > a.firstWord.toLowerCase())
            return 1;
          return 0;
        });
        break;
    }
  }

  randomBool() {
    return Math.random() < 0.5;
  }

  wordsPrepare(row, lang) {
    let coupleWords = {};
    if(row.language === lang) {
      coupleWords['firstWord'] = row.word;
      coupleWords['firstLanguage'] = row.language;
      coupleWords['secondWord'] = row.translateWord;
      coupleWords['secondLanguage'] = row.translateLanguage;
    } else {
      coupleWords['firstWord'] = row.translateWord;
      coupleWords['firstLanguage'] = row.translateLanguage;
      coupleWords['secondWord'] = row.word;
      coupleWords['secondLanguage'] = row.language;
    }
    coupleWords['id'] = row.id;
    return coupleWords;
  }

  playRow(row) {
    this.deleteMarkFromWords();
    this.wordsForSpeak = [];
    this.wordsForSpeak.push({
      text: row.firstWord,
      rate: 1,
      locale: row.firstLanguage,
      id: row.id,
      first: true
    });
    this.wordsForSpeak.push({
      text: row.secondWord,
      rate: 1,
      locale: row.secondLanguage,
      id: row.id
    });

    if(this.play) {
      this.tts.speak('')
        .then(() => {
          this.play = false;
          this.speak();
        })
        .catch(err => console.log(err))
    } else {
      this.speak();
    }
  }

  playModule() {
    if(this.play) {
      this.tts.speak('');
      this.wordsForSpeak = [];
      return this.play = false;
    }

    this.wordsForSpeak = [];
    this.deleteMarkFromWords();
    this.words.forEach((row) => {
      this.wordsForSpeak.push({
        text: row.firstWord,
        rate: 1,
        locale: row.firstLanguage,
        id: row.id,
        first: true
      });
      this.wordsForSpeak.push({
        text: row.secondWord,
        rate: 1,
        locale: row.secondLanguage,
        id: row.id
      });
    });

    this.speak();
  }

  speak() {
    this.play = true;
    this.counter = 0;
    let that = this;
    goSpeak();

    function goSpeak() {
      if (that.counter < that.wordsForSpeak.length) {
        let pause = 0;
        if(that.wordsForSpeak[that.counter].first) {
          pause = that.learningSettings.pauseBetweenWords * 1000;
        } else {
          pause = that.learningSettings.pauseBetweenACouple* 1000;
        }

        that.markWord(that.wordsForSpeak[that.counter]);
        that.tts.speak(that.wordsForSpeak[that.counter])
          .then(() => {
            that.counter++;
            setTimeout(() => {
              goSpeak();
            }, pause);
          }, (err) => {
            console.log(err);
          });
      } else {
        that.play = false;
      }
    }
  }

  markWord(item) {
    this.words.forEach((row) => {
      if(row.id === item.id) {
        row.speaked = true;
      }
    })
  }

  deleteMarkFromWords() {
    this.words.forEach((row) => {
        delete row.speaked;
    })
  }

  editModule() {
    this.navCtrl.push('EditModulePage',
      {
        module: this.module,
        words: this.rowsFromDb
      });
  }

  openSettings() {
    this.navCtrl.push('LearningSettingsPage');
  }
}
